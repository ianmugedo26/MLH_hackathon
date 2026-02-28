import { useState } from 'react' // Note: 'React' import is optional in modern JSX

function App() {
    const [inputText, setInputText] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setLoading(true);
    try {
        console.log("Attempting to connect to backend...");
        const res = await fetch('http://localhost:3000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: inputText })
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Server responded with ${res.status}: ${errorText}`);
        }

        const data = await res.json();
        setResult(data);
    } catch (err) {
        // This will print the actual error to your console
        console.error("DETAILED ERROR:", err);
        alert(`Connection Failed: ${err.message}`);
    } finally {
        setLoading(false);
    }
}

    // Helper to pick colors based on AI risk level
    const getTheme = () => {
        switch(result?.risk_level) {
            case 'High': return { text: 'text-red-500', bg: 'bg-red-500', border: 'border-red-900/50', glow: 'shadow-red-500/20' };
            case 'Medium': return { text: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-900/50', glow: 'shadow-yellow-500/20' };
            default: return { text: 'text-green-500', bg: 'bg-green-500', border: 'border-green-900/50', glow: 'shadow-green-500/20' };
        }
    }

    const theme = getTheme();

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-sans">
            <div className="max-w-2xl w-full">
                
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

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Paste M-Pesa or Bank SMS here..."
                            className="w-full px-6 py-5 bg-gray-800/50 rounded-2xl border-2 border-gray-700 
                                     focus:border-blue-500 focus:outline-none transition-all 
                                     min-h-[140px] text-lg backdrop-blur-sm"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl 
                                 transition-all transform ${loading ? 'opacity-50' : 'hover:scale-[1.01] active:scale-95'} 
                                 shadow-xl shadow-blue-900/20`}
                    >
                        {loading ? 'Analyzing Security Patterns...' : 'Verify Message'}
                    </button>
                </form>

                {/* Structured Results Card */}
                {result && (
                    <div className={`mt-8 p-6 bg-gray-800 rounded-3xl border-2 ${theme.border} ${theme.glow} 
                                  animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                        
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className={`h-2.5 w-2.5 rounded-full ${theme.bg} animate-pulse`} />
                                    <span className={`text-sm font-black uppercase tracking-widest ${theme.text}`}>
                                        {result.risk_level} Risk Level
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-white">Analysis Result</h2>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500 uppercase font-bold">Confidence</div>
                                <div className="text-xl font-mono text-gray-300">{(result.confidence_score * 100).toFixed(0)}%</div>
                            </div>
                        </div>
                        
                        <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                            {result.explanation}
                        </p>

                        {/* Red Flags Chips */}
                        {result.red_flags?.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Detected Red Flags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.red_flags.map((flag, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                                            ⚠️ {flag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Box */}
                        <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                            <h3 className="text-xs font-bold text-blue-400 uppercase mb-1 tracking-widest">Recommended Action</h3>
                            <p className="text-blue-100 font-medium">{result.recommended_action}</p>
                        </div>

                        <button 
                            onClick={() => {setResult(null); setInputText('')}}
                            className="mt-8 w-full text-center text-sm text-gray-500 hover:text-white transition-colors"
                        >
                            Reset and scan new message
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default App