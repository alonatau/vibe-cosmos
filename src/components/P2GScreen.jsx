import { useState, useEffect, useRef } from 'react';
import CompletionOverlay from './CompletionOverlay.jsx';

// Prompt-to-Game flow: a single text input. On submit the same supernova /
// typewriter completion plays, with the user's prompt as the game name.
export default function P2GScreen({ onExit }) {
  const [prompt, setPrompt] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onExit?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onExit]);

  const submit = () => {
    const cleaned = prompt.trim();
    if (cleaned.length === 0) return;
    setSubmitted(true);
  };

  // Title-case the prompt for the headline; keep it ≤ 60 chars
  const headline = (() => {
    const t = prompt.trim().slice(0, 60);
    if (t.length === 0) return '';
    return t.charAt(0).toUpperCase() + t.slice(1);
  })();

  const insight = submitted
    ? {
        headline,
        body: 'Playo will now generate your game…',
        anchor: null,
        skipSupernova: true, // no orb burst in P2G — start headline reveal sooner
      }
    : null;

  return (
    <div className="p2g-root">
      <div className="intro-bg" />
      {!submitted && (
        <div className="p2g-stack">
          <div className="intro-eyebrow">Prompt to Game</div>
          <h1 className="p2g-headline">Describe the game you want</h1>
          <textarea
            ref={inputRef}
            className="p2g-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="A cozy fishing rpg in a watercolour island town with a cat companion…"
            rows={4}
            maxLength={400}
          />
          <div className="p2g-actions">
            <span className="p2g-hint">enter to submit · shift-enter for newline · esc to go back</span>
            <button
              type="button"
              className="p2g-submit"
              onClick={submit}
              disabled={prompt.trim().length === 0}
            >
              Generate
            </button>
          </div>
        </div>
      )}
      <CompletionOverlay active={submitted} insight={insight} />
    </div>
  );
}
