"use client";

import { useState } from "react";

const TONES = ["Casual", "Formal", "Very Formal", "Funny", "Emotional", "Serious"];

const STRENGTHS = [
  { id: "Low",    emoji: "🟢", label: "Low",    desc: "Everyday, safe" },
  { id: "Medium", emoji: "🟡", label: "Medium", desc: "Slightly enhanced" },
  { id: "High",   emoji: "🔴", label: "High",   desc: "Creative chain" },
];

interface ExcuseResult {
  excuses: string[];
  best: string;
  tip: string;
}

export default function Home() {
  const [situation, setSituation] = useState("");
  const [tone, setTone] = useState("Casual");
  const [lieStrength, setLieStrength] = useState("Low");
  const [context, setContext] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExcuseResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!situation.trim()) {
      setError("Please describe your situation first.");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const API = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${API}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      situation: situation.trim(),
      tone,
      lie_strength: lieStrength,
      context: context.trim() || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Something went wrong.");
      }

      const data: ExcuseResult = await res.json();
      setResult(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to connect to the API. Make sure the backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      {/* Animated mesh background */}
      <div className="bg-mesh" />

      <main className="page-wrapper">
        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-badge">
            <span>🛡️</span>
            <span>AI-Powered Cover Stories</span>
          </div>
          <h1 className="hero-title">CoverMe</h1>
          <p className="hero-tagline">
            Realistic excuses, crafted in seconds. Never get caught off-guard again.
          </p>
        </section>

        {/* ── FORM CARD ── */}
        <div className="glass-card">
          {/* Situation */}
          <div className="field-group">
            <label className="field-label" htmlFor="situation">
              What do you need an excuse for?
            </label>
            <textarea
              id="situation"
              className="input-textarea"
              placeholder="e.g. I am late for an office meeting..."
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              rows={3}
            />
          </div>

          {/* Tone */}
          <div className="field-group">
            <label className="field-label">Tone</label>
            <div className="pill-group">
              {TONES.map((t) => (
                <button
                  key={t}
                  id={`tone-${t.toLowerCase().replace(" ", "-")}`}
                  className={`pill${tone === t ? " active" : ""}`}
                  onClick={() => setTone(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Lie Strength */}
          <div className="field-group">
            <label className="field-label">Lie Strength</label>
            <div className="strength-group">
              {STRENGTHS.map((s) => (
                <button
                  key={s.id}
                  id={`strength-${s.id.toLowerCase()}`}
                  className={`strength-card ${s.id.toLowerCase()}${lieStrength === s.id ? " active" : ""}`}
                  onClick={() => setLieStrength(s.id)}
                >
                  <span className="emoji">{s.emoji}</span>
                  <span className="label">{s.label}</span>
                  <span className="desc">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Context */}
          <div className="field-group">
            <button
              id="toggle-context"
              className={`context-toggle${showContext ? " open" : ""}`}
              onClick={() => setShowContext(!showContext)}
            >
              <span className="chevron">▼</span>
              Add optional context (urgency, workplace type, etc.)
            </button>
            {showContext && (
              <textarea
                id="optional-context"
                className="input-textarea"
                placeholder="e.g. Corporate job, meeting with the CEO, first time being late..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={2}
              />
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="error-banner">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* CTA */}
          <button
            id="generate-btn"
            className="cta-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Crafting your cover story...
              </>
            ) : (
              "🛡️ Generate My Cover Story"
            )}
          </button>
        </div>

        {/* ── RESULTS ── */}
        {result && (
          <div className="results-wrapper">
            <div className="results-title">Your Excuses</div>

            {/* 3 Excuse Cards */}
            <div className="excuse-cards">
              {result.excuses.map((excuse, idx) => (
                <div key={idx} className="excuse-card">
                  <div className="excuse-number">{idx + 1}</div>
                  <div className="excuse-text">{excuse}</div>
                  <button
                    id={`copy-excuse-${idx + 1}`}
                    className="copy-btn"
                    title="Copy to clipboard"
                    onClick={() => copyToClipboard(excuse, idx)}
                  >
                    {copied === idx ? "✅" : "📋"}
                  </button>
                </div>
              ))}
            </div>

            {/* Best Pick */}
            <div className="best-pick-card">
              <div className="best-pick-header">
                <span>⭐</span> Best Pick
              </div>
              <div className="best-pick-text">{result.best}</div>
            </div>

            {/* Pro Tip */}
            <div className="pro-tip-card">
              <div className="tip-icon">💡</div>
              <div className="tip-content">
                <div className="tip-label">Pro Tip</div>
                <div className="tip-text">{result.tip}</div>
              </div>
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <footer className="footer">
          <p>CoverMe AI — Built for real-life situations 🛡️</p>
        </footer>
      </main>
    </>
  );
}
