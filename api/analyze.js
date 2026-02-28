import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


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
"${message.trim()}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        //Attempt to parse json safely
        // Gemini sometimes adds ```json ... ``` or extra whitespace/newlines
        text = text.trim();
        if (text.startsWith("```json")) {
            text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (text.startsWith("```")) {
            text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        let json;
        try {
            json = JSON.parse(text);
        } catch (parseErr) {
            console.error("JSON parse failed:", parseErr);
            console.error("Raw AI output:", text);
            return res.status(500).json({
                error: "AI returned invalid JSON format"
            });
        }

        // Optional: basic validation of the structure
        if (!json.risk_level || !["Low", "Medium", "High"].includes(json.risk_level)) {
            return res.status(500).json({ error: "Invalid risk_level from AI" });
        }

        res.json(json);
    } catch (error) {
        console.error("Analysis error:", error);
        res.status(500).json({ error: "AI analysis failed" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
