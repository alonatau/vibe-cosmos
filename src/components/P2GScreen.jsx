import { useState, useEffect, useRef } from 'react';
import CompletionOverlay from './CompletionOverlay.jsx';
import CompletionCanvas from './CompletionCanvas.jsx';

// Prompt-to-Game flow: textarea → on submit, the typed prompt's letters
// fly magically from the prompt bar into the wireframe cube, the cube
// absorbs them, purple sparkle erupts, and the headline (the prompt as
// the game name) appears above.
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

// Each letter takes a unique magical flight from the prompt-bar position
// down into the cube. Per-char curve/lift/rotation values are deterministic
// (based on index) so the stream looks orchestrated, not random.
const STAGGER_MS = 22;
const FLIGHT_MS = 1500;
const FIRST_CHAR_DELAY_MS = 400;

function FlyingLetters({ text }) {
  const display = (text || '').slice(0, 80);
  // Horizontal drift at the apex — alternating sides so letters spread
  // outward then converge back toward the cube.
  const curveFor = (i) => {
    const sign = i % 2 === 0 ? 1 : -1;
    const mag = 70 + ((i * 13) % 80); // 70–149 px
    return `${sign * mag}px`;
  };
  // Lift amount before descending — varies per letter for organic feel.
  const liftFor = (i) => `${-(18 + ((i * 7) % 30))}px`;
  // Mid-flight rotation
  const rotMidFor = (i) => `${((i * 23) % 36) - 18}deg`;
  // End rotation — spiral as it enters the cube
  const rotEndFor = (i) => `${((i * 47) % 540) - 270}deg`;

  return (
    <div className="p2g-flying">
      {display.split('').map((c, i) => (
        <span
          key={i}
          className="p2g-flying-char"
          style={{
            animationDelay: `${FIRST_CHAR_DELAY_MS + i * STAGGER_MS}ms`,
            animationDuration: `${FLIGHT_MS}ms`,
            '--curveX': curveFor(i),
            '--liftY': liftFor(i),
            '--rotMid': rotMidFor(i),
            '--rotEnd': rotEndFor(i),
          }}
        >
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </div>
  );
}
