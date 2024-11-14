import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import { KeyboardControls } from '@react-three/drei';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
];

function App() {
  return (
    <KeyboardControls map={keyboardMap}>
      {/* near 최소 가시 거리, fov 시야 각 */}
      <Canvas
        shadows
        camera={{ position: [3, 3, 3], near: 0.1, fov: 60 }}
        style={{ touchAction: 'none' }} // 브라우저 기본 동작 방지
      >
        <color attach="background" args={['skyblue']} />
        <Scene />
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
