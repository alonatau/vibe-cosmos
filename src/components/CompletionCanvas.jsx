import { Canvas } from '@react-three/fiber';
import Completion from './Completion.jsx';

// Standalone Canvas for the end-screen cube + sparkles. Used by P2G; CCP
// renders Completion directly inside the main VibeUniverse Canvas.
export default function CompletionCanvas({ active }) {
  return (
    <div className="completion-canvas">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 14], fov: 55, near: 0.1, far: 200 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#050510']} />
        <ambientLight intensity={0.4} />
        <Completion active={active} />
      </Canvas>
    </div>
  );
}
