import { useState, useCallback, useRef } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

interface Solution { problem: string; steps: string[]; answer: string; difficulty: string; topic: string; }

function SolvePage() {
  const [inputMode, setInputMode] = useState<'text' | 'photo'>('text');
  const [text, setText] = useState('');
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Solution | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const solve = useAction(api.ai.solveProblem);
  const save = useMutation(api.functions.saveSolution);

  const handleSolve = useCallback(async () => {
    setLoading(true); setResult(null);
    try {
      const r = await solve(inputMode === 'photo' ? { imageBase64: img! } : { textProblem: text.trim() });
      setResult(r);
      await save({ problem: r.problem || text, solution: r.steps?.join('\n') || '', steps: r.steps || [], answer: r.answer || '', difficulty: r.difficulty || 'medium', topic: r.topic || 'math' });
    } catch (e: any) { console.error(e); } finally { setLoading(false); }
  }, [inputMode, text, img, solve, save]);

  const handleFile = (f: File) => { const r = new FileReader(); r.onload = (e) => setImg(e.target?.result as string); r.readAsDataURL(f); };
  const canSubmit = inputMode === 'text' ? text.trim().length > 0 : !!img;

  return (
    <div className="main-content"><div className="solve-page">
      <h1 className="solve-title">Snap. <span className="accent">Solve.</span> Learn.</h1>
      <p className="solve-subtitle">Upload a photo of a math problem or type it in — get a step-by-step solution instantly.</p>
      <div className="input-tabs">
        <button className={`tab-btn ${inputMode === 'text' ? 'active' : ''}`} onClick={() => setInputMode('text')}>✏️ Type Problem</button>
        <button className={`tab-btn ${inputMode === 'photo' ? 'active' : ''}`} onClick={() => setInputMode('photo')}>📸 Upload Photo</button>
      </div>
      {inputMode === 'text' ? (
        <textarea className="text-area" value={text} onChange={e => setText(e.target.value)} placeholder="e.g. Solve for x: 3x² + 5x - 2 = 0" rows={4} />
      ) : (
        <div>
          {img ? <div className="preview-container"><img src={img} alt="Problem" className="preview-image" /><br /><button className="tab-btn" onClick={() => setImg(null)} style={{ marginTop: '0.5rem' }}>Remove</button></div>
            : <div className="dropzone" onClick={() => fileRef.current?.click()}><p>📷 Click to upload a math problem photo</p><input ref={fileRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} /></div>}
        </div>
      )}
      <button className="btn-solve" disabled={!canSubmit || loading} onClick={handleSolve}>{loading ? '⏳ Solving...' : '🧮 Solve'}</button>
      {loading && <div className="loading-dots"><span /><span /><span /></div>}
      {result && !loading && (
        <div className="solution-card">
          <div className="solution-header"><span style={{ fontSize: '1.5rem' }}>✅</span><h2>Solution</h2></div>
          <div className="solution-body">
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>{result.problem}</p>
            {result.steps.map((s, i) => (<div key={i} className="step"><span className="step-num">{i + 1}</span><span className="step-text">{s}</span></div>))}
            <div className="answer-box"><div className="answer-label">Final Answer</div><div className="answer-value">{result.answer}</div></div>
            <div className="meta-chips"><span className="meta-chip">{result.difficulty}</span><span className="meta-chip">{result.topic}</span></div>
          </div>
        </div>
      )}
    </div></div>
  );
}

function App() {
  return (<BrowserRouter><div className="app-container">
    <header className="header"><a href="/" className="header-logo"><span style={{ fontSize: '1.5rem' }}>🧮</span><div><h1>MathSnap</h1></div></a></header>
    <Routes><Route path="/" element={<SolvePage />} /></Routes>
    <footer className="footer">© {new Date().getFullYear()} MathSnap — An AVS Media App.</footer>
  </div></BrowserRouter>);
}
export default App;
