import { useEffect, useState } from 'react';

// Phased reveal: white flash at the supernova peak, then headline (the game
// name) → body ("Playo will now generate your game…") → restart hint.
// `insight` carries { headline, body, anchor } from scoring.js.
export default function CompletionOverlay({ active, insight }) {
  const [headlineShown, setHeadlineShown] = useState(0);
  const [bodyVisible, setBodyVisible] = useState(false);
  const [anchorVisible, setAnchorVisible] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [showRestart, setShowRestart] = useState(false);

  useEffect(() => {
    if (!active || !insight) {
      setHeadlineShown(0);
      setBodyVisible(false);
      setAnchorVisible(false);
      setFlashing(false);
      setShowRestart(false);
      return;
    }

    const timers = [];
    const push = (fn, t) => timers.push(window.setTimeout(fn, t));

    // White flash at the supernova peak (matches sphere's burst beat ~1.95s).
    // P2G mode skips the supernova — flash at t=0 instead.
    const flashAt = insight.skipSupernova ? 80 : 1900;
    const flashOff = flashAt + 600;
    const headlineStart = insight.skipSupernova ? 350 : 2300;

    push(() => setFlashing(true), flashAt);
    push(() => setFlashing(false), flashOff);

    // Headline typewriter — characters appear with chromatic-glitch animation
    const headline = insight.headline || '';
    const headlineStep = 42;
    for (let i = 1; i <= headline.length; i++) {
      push(() => setHeadlineShown(i), headlineStart + i * headlineStep);
    }
    const headlineEnd = headlineStart + headline.length * headlineStep;

    // Body line — the Playo handoff text — fades in once the headline lands
    push(() => setBodyVisible(true), headlineEnd + 500);

    if (insight.anchor) {
      push(() => setAnchorVisible(true), headlineEnd + 1800);
    }

    push(() => setShowRestart(true), headlineEnd + 2400);

    return () => timers.forEach(window.clearTimeout);
  }, [active, insight]);

  if (!active || !insight) return null;

  const renderChars = (str) =>
    str.split('').map((c, i) => (
      <span key={i} className="cmp-char">
        {c === ' ' ? ' ' : c}
      </span>
    ));

  const headlineVisible = (insight.headline || '').slice(0, headlineShown);

  return (
    <>
      <div className={`cmp-flash${flashing ? ' is-on' : ''}`} />
      <div className="cmp-overlay">
        <div className="cmp-stack">
          <div className="cmp-main">{renderChars(headlineVisible)}</div>
          <div className={`cmp-body${bodyVisible ? ' is-shown' : ''}`}>
            {insight.body}
          </div>
          {insight.anchor && (
            <div className={`cmp-anchor${anchorVisible ? ' is-shown' : ''}`}>
              {insight.anchor}
            </div>
          )}
        </div>
        <div className={`cmp-restart${showRestart ? ' is-shown' : ''}`}>
          press esc to start over
        </div>
      </div>
    </>
  );
}
