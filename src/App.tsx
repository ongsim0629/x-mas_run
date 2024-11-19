import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import { KeyboardControls } from '@react-three/drei';
import SocketController from './components/controller/SocketController';
import { gameScreenAtom } from './atoms/GameAtoms';
import { GameScreen } from './types/game';
import { useAtom } from 'jotai';
import LoadingPage from './components/pages/LoadingPage';
import LoginPage from './components/pages/LoginPage';
import HomePage from './components/pages/HomePage';
import MatchingPage from './components/pages/MatchingPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GameTimer } from './components/pages/GameTimer';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'catch', keys: ['Shift'] },
];

function App() {
  // 추후 아래 defaultOptions에서 error 처리 설정
  const queryClient = new QueryClient({
    defaultOptions: {},
  });
  const [gameScreen] = useAtom(gameScreenAtom);

  return (
    <KeyboardControls map={keyboardMap}>
      <QueryClientProvider client={queryClient}>
        <SocketController />
        {gameScreen === GameScreen.LOADING && <LoadingPage />}
        {gameScreen === GameScreen.LOGIN && <LoginPage />}
        {gameScreen === GameScreen.HOME && <HomePage />}
        {gameScreen === GameScreen.MATCHING && <MatchingPage />}
        {gameScreen === GameScreen.GAME && (
          <div className="relative w-screen h-screen">
            <GameTimer />
            <Canvas
              shadows
              camera={{ position: [3, 3, 3], near: 0.1, fov: 60 }}
              style={{ touchAction: 'none' }}
              className="w-full h-full"
            >
              <color attach="background" args={['skyblue']} />
              <Scene />
            </Canvas>
          </div>
        )}
      </QueryClientProvider>
    </KeyboardControls>
  );
}
export default App;
