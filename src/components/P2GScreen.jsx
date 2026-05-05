import { useState, useEffect, useRef } from 'react';
import CompletionOverlay from './CompletionOverlay.jsx';
import CompletionCanvas from './CompletionCanvas.jsx';

// Prompt-to-Game flow: textarea → on submit, the typed prompt's letters
// stream into the wireframe cube, the cube absorbs them, purple sparkle
// erupts, and the headline (the prompt as the game name) appears above.
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

  const headline = (() => {
    const t = prompt.trim().slice(0, 60);
    if (t.length === 0) return '';
    return t.charAt(0).toUpperCase() + t.slice(1);
  })();

  // Same insight shape as CCP — full cube/burst/sparkle sequence.
  const insight = submitted
    ? {
        headline,
        body: 'Playo will now generate your game…',
        anchor: null,
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
      {submitted && (
        <>
          <CompletionCanvas active={true} />
          <FlyingLetters text={prompt} />
        </>
      )}
      <CompletionOverlay active={submitted} insight={insight} />
    </div>
  );
}

// Render each character as an inline span; per-char animation-delay creates
// the staggered "stream into the box" effect. Each char arrives at the cube
// before MAGIC_BURST_AT (~2.2s) so the burst absorbs them.
const STAGGER_MS = 32;
const FLIGHT_MS = 1200;
const FIRST_CHAR_DELAY_MS = 550;

function FlyingLetters({ text }) {
  const display = (text || '').slice(0, 60);
  // Tiny deterministic horizontal drift per char so letters curve toward
  // the cube instead of falling in straight columns.
  const driftFor = (i) => {
    const offset = ((i * 41) % 17) - 8; // -8..+8, deterministic
    return `${offset * 6}px`;
  };
  return (
    <div className="p2g-flying">
      {display.split('').map((c, i) => (
        <span
          key={i}
          className="p2g-flying-char"
          style={{
            animationDelay: `${FIRST_CHAR_DELAY_MS + i * STAGGER_MS}ms`,
            animationDuration: `${FLIGHT_MS}ms`,
            '--drift': driftFor(i),
          }}
        >
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </div>
  );
}
