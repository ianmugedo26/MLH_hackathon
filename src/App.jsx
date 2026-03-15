import { useState } from 'react'

function App() {
    const [inputText, setInputText] = useState('')
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null); // Added preview
    const [response, setResponse] = useState('')
    const [loading, setLoading] = useState(false)

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file)); // Show the user what they uploaded
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage({
                    inlineData: {
                        data: reader.result.split(',')[1],
                        mimeType: file.type
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!inputText && !image) return alert("Please provide text or an image.");
        
        setResponse(''); // Clear old response
        setLoading(true)
        
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const res = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: inputText, image: image })
            })
            const data = await res.json()
            // setResponse(data.reply || data.error)
            const cleanReply = data.reply ? data.reply.replace(/\*/g, '') : '';
        setResponse(cleanReply);
        } catch (err) {
            setResponse("Network Connection Error. Check your connection and try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
             {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <video
              src="/iL6EN8FmBa0TNj8rB2.mp4"
              autoPlay loop muted playsInline
              className="w-32 h-32 rounded-full shadow-2xl object-cover border-4 border-gray-800"
            />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            SCAM<span className="text-blue-500">RADAR</span> EA
          </h1>
          <p className="text-gray-400">Advanced AI protection against East African SMS fraud</p>
        </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Paste suspicious text or links here..."
                        className="w-full px-6 py-4 rounded-2xl bg-white text-lg min-h-30 focus:ring-4 focus:ring-blue-500 outline-none"
                    />

                    <div className="relative group flex flex-col items-center p-6 border-2 border-dashed border-gray-500 rounded-2xl bg-gray-800 transition-all hover:border-blue-400">
                        {preview ? (
                            <div className="relative">
                                <img src={preview} alt="Preview" className="max-h-40 rounded-lg mb-2" />
                                <button onClick={() => {setPreview(null); setImage(null)}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs">✕</button>
                            </div>
                        ) : (
                            <label className="cursor-pointer text-gray-400 group-hover:text-blue-400">
                                <span className="text-lg">📸 Upload Screenshot</span>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        )}
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 bg-blue-600 text-white font-bold rounded-2xl text-xl shadow-xl transition-all ${loading ? 'opacity-50' : 'hover:bg-blue-500 hover:scale-[1.02]'}`}
                    >
                        {loading ? '🔍 Scanning Content...' : 'Verify Authenticity'}
                    </button>
                </form>

                {response && (
                    <div className="mt-8 p-6 bg-gray-800 rounded-2xl text-left border-l-8 border-blue-500 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h2 className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">AI Security Report</h2>
                        <div className="text-gray-100 text-lg leading-relaxed whitespace-pre-wrap">{response}</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default App