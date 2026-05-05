// First screen the user lands on. Two paths into Playo's discovery flow:
// P2G (prompt to game — describe in words) or CCP (click click play —
// the 3D drill-down). Pure HTML/CSS over the same cosmos background.

export default function IntroScreen({ onPick }) {
  return (
    <div className="intro-root">
      <div className="intro-bg" />
      <div className="intro-stack">
        <div className="intro-eyebrow">Playo</div>
        <h1 className="intro-headline">How do you want to find your game?</h1>
        <div className="intro-cards">
          <button
            type="button"
            className="intro-card intro-card-p2g"
            onClick={() => onPick('p2g')}
          >
            <div className="intro-card-tag">P2G</div>
            <div className="intro-card-title">Prompt to Game</div>
            <div className="intro-card-sub">Describe what you want in words</div>
          </button>
          <button
            type="button"
            className="intro-card intro-card-ccp"
            onClick={() => onPick('ccp')}
          >
            <div className="intro-card-tag">CCP</div>
            <div className="intro-card-title">Click Click Play</div>
            <div className="intro-card-sub">Pick what feels right, three times</div>
          </button>
        </div>
      </div>
    </div>
  );
}
