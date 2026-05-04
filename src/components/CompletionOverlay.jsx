import { useEffect, useState } from 'react';

const MAIN = 'Playo will now generate your game';
const SUB = 'Based on your vibe';

// Phase-driven HTML overlay: white flash at supernova peak, typewriter
// reveal of the headline, looping dots while "thinking", then subtitle, then
// a faint restart hint. Times below are relative to the moment `active` flips on.
export default function CompletionOverlay({ active }) {
  const [mainShown, setMainShown] = useState(0);
  const [subShown, setSubShown] = useState(0);
  const [dotCount, setDotCount] = useState(0);
  const [flashing, setFlashing] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [glowing, setGlowing] = useState(false);

  useEffect(() => {
    if (!active) {
      setMainShown(0);
      setSubShown(0);
      setDotCount(0);
      setFlashing(false);
      setShowRestart(false);
      setGlowing(false);
      return;
    }

    const timers = [];
    const push = (fn, t) => timers.push(window.setTimeout(fn, t));

    // White flash at the supernova peak (matches sphere's burst beat)
    push(() => setFlashing(true), 1900);
    push(() => setFlashing(false), 2500);

    // Headline typewriter — characters appear ~38ms apart
    const mainStart = 2300;
    const mainStep = 38;
    for (let i = 1; i <= MAIN.length; i++) {
      push(() => setMainShown(i), mainStart + i * mainStep);
    }
    push(() => setGlowing(true), mainStart + MAIN.length * mainStep + 100);
    const mainEnd = mainStart + MAIN.length * mainStep;

    // Looping dots — 4 cycles of 1→2→3 (~1.5s of "thinking")
    const dotsStart = mainEnd + 180;
    const dotStep = 130;
    const cycles = 4;
    for (let k = 0; k < cycles; k++) {
      push(() => setDotCount(1), dotsStart + k * dotStep * 3);
      push(() => setDotCount(2), dotsStart + k * dotStep * 3 + dotStep);
      push(() => setDotCount(3), dotsStart + k * dotStep * 3 + dotStep * 2);
    }
    const dotsEnd = dotsStart + cycles * dotStep * 3;
    push(() => setDotCount(3), dotsEnd);

    // Subtitle typewriter
    const subStart = dotsEnd + 250;
    const subStep = 28;
    for (let i = 1; i <= SUB.length; i++) {
      push(() => setSubShown(i), subStart + i * subStep);
    }
    const subEnd = subStart + SUB.length * subStep;

    // Restart hint, well after the show
    push(() => setShowRestart(true), subEnd + 700);

    return () => timers.forEach(window.clearTimeout);
  }, [active]);

  if (!active) return null;

  const renderChars = (str) =>
    str.split('').map((c, i) => (
      <span key={i} className="cmp-char">
        {c === ' ' ? ' ' : c}
      </span>
    ));

  const dots = '.'.repeat(dotCount);

  return (
    <>
      <div className={`cmp-flash${flashing ? ' is-on' : ''}`} />
      <div className="cmp-overlay">
        <div className={`cmp-main${glowing ? ' is-glowing' : ''}`}>
          {renderChars(MAIN.slice(0, mainShown))}
          {mainShown >= MAIN.length && (
            <span className="cmp-dots">{dots}</span>
          )}
        </div>
        <div className="cmp-sub">{renderChars(SUB.slice(0, subShown))}</div>
        <div className={`cmp-restart${showRestart ? ' is-shown' : ''}`}>
          press esc to start over
        </div>
      </div>
    </>
  );
}
