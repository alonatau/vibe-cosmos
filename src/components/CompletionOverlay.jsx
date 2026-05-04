import { useEffect, useState } from 'react';

const FOOTER = 'generating your game';

// Phased reveal: white flash at the supernova peak, then headline → body →
// citation chip → footer. Each layer is keyed off the same `active` timer so
// they cascade. `insight` carries { headline, body, anchor } from scoring.js.
export default function CompletionOverlay({ active, insight }) {
  const [headlineShown, setHeadlineShown] = useState(0);
  const [bodyVisible, setBodyVisible] = useState(false);
  const [anchorVisible, setAnchorVisible] = useState(false);
  const [footerShown, setFooterShown] = useState(0);
  const [flashing, setFlashing] = useState(false);
  const [showRestart, setShowRestart] = useState(false);

  useEffect(() => {
    if (!active || !insight) {
      setHeadlineShown(0);
      setBodyVisible(false);
      setAnchorVisible(false);
      setFooterShown(0);
      setFlashing(false);
      setShowRestart(false);
      return;
    }

    const timers = [];
    const push = (fn, t) => timers.push(window.setTimeout(fn, t));

    // White flash at the supernova peak (matches sphere's burst beat ~1.95s)
    push(() => setFlashing(true), 1900);
    push(() => setFlashing(false), 2500);

    // Headline typewriter — characters appear with chromatic-glitch animation
    const headline = insight.headline;
    const headlineStart = 2300;
    const headlineStep = 42;
    for (let i = 1; i <= headline.length; i++) {
      push(() => setHeadlineShown(i), headlineStart + i * headlineStep);
    }
    const headlineEnd = headlineStart + headline.length * headlineStep;

    // Body paragraph fades in once the headline lands
    push(() => setBodyVisible(true), headlineEnd + 600);

    // Anchor citation a beat later
    push(() => setAnchorVisible(true), headlineEnd + 2200);

    // Footer "generating your game" types in last
    const footerStart = headlineEnd + 3400;
    const footerStep = 35;
    for (let i = 1; i <= FOOTER.length; i++) {
      push(() => setFooterShown(i), footerStart + i * footerStep);
    }
    const footerEnd = footerStart + FOOTER.length * footerStep;

    push(() => setShowRestart(true), footerEnd + 800);

    return () => timers.forEach(window.clearTimeout);
  }, [active, insight]);

  if (!active || !insight) return null;

  const renderChars = (str) =>
    str.split('').map((c, i) => (
      <span key={i} className="cmp-char">
        {c === ' ' ? ' ' : c}
      </span>
    ));

  const headlineVisible = insight.headline.slice(0, headlineShown);
  const footerVisible = FOOTER.slice(0, footerShown);

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
          <div className="cmp-footer">
            {footerShown > 0 && (
              <>
                {renderChars(footerVisible)}
                {footerShown >= FOOTER.length && (
                  <span className="cmp-dots">…</span>
                )}
              </>
            )}
          </div>
        </div>
        <div className={`cmp-restart${showRestart ? ' is-shown' : ''}`}>
          press esc to start over
        </div>
      </div>
    </>
  );
}
