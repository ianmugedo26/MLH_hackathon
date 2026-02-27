import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json);


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/analyze", async(req ,res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }
        const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

        const prompt =
       `You are a cybersecurity expert specializing in East African SMS Fraud detection.
        Analyze the following SMS message from scam risk.
        Return ONLY valid JSON in this exact format:

        {
            "risk_level": "Low | Medium | High",
            "confidence_score": 0.0-1.0,
            "red_flags": ["string"],
            "explanation": "string",
            "recommendated_action": "string"
        }

        SMS:
        "${message}"    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        //Attempt to parse json safely
        const json = JSON.parse(text);

        res.json(json);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI analysis failed"});
    }
});
app.listen(5000, () => {
    console.log("Server is running on https://localhost:5000");
});
