import { useState, useEffect } from 'react';
import IntroScreen from './components/IntroScreen.jsx';
import P2GScreen from './components/P2GScreen.jsx';
import VibeUniverse from './components/VibeUniverse.jsx';

export default function App() {
  // 'intro' → 'p2g' | 'ccp'
  const [mode, setMode] = useState('intro');
  const goIntro = () => setMode('intro');

  // Listen for a global "go-home" event the CCP flow dispatches when the
  // user fully resets from depth 0 — keeps VibeUniverse decoupled from App.
  useEffect(() => {
    const onHome = () => goIntro();
    window.addEventListener('vibe-cosmos:home', onHome);
    return () => window.removeEventListener('vibe-cosmos:home', onHome);
  }, []);

  if (mode === 'intro') return <IntroScreen onPick={setMode} />;
  if (mode === 'p2g') return <P2GScreen onExit={goIntro} />;
  return <VibeUniverse onExit={goIntro} />;
}
