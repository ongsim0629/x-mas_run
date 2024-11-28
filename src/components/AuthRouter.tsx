import { useAtom, useAtomValue } from 'jotai';
import { gameScreenAtom } from '../atoms/GameAtoms';
import { GameScreen } from '../types/game';
import SocketController from '../controller/SocketController';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import MatchingPage from '../pages/MatchingPage';
import { GameTimer } from '../components/UI/GameTimer';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import GameOverPage from '../pages/GameOverPage';
import { playerInfoAtom } from '../atoms/PlayerAtoms';
import KillLogs from './KillLogs';
import { useEffect } from 'react';

const AuthRouter = () => {
  const [gameScreen, setGameScreen] = useAtom(gameScreenAtom);
  const { id } = useAtomValue(playerInfoAtom);

  useEffect(() => {
    if (!id && gameScreen !== GameScreen.LOGIN) {
      setGameScreen(GameScreen.LOGIN);
    }
  }, [id, gameScreen, setGameScreen]);

  if (!id) {
    return <LoginPage />;
  }

  return (
    <>
      {gameScreen === GameScreen.HOME && <HomePage />}
      <SocketController />
      {gameScreen === GameScreen.MATCHING && <MatchingPage />}
      {gameScreen === GameScreen.GAME && (
        <div className="relative w-screen h-screen">
          <GameTimer />
          <Canvas
            shadows
            camera={{ position: [3, 3, 3], near: 0.1, fov: 60 }}
            style={{ touchAction: 'none' }}
            className="w-full h-full"
            gl={{ failIfMajorPerformanceCaveat: true }}
          >
            <color attach="background" args={['#0D1B2A']} />
            <Scene />
          </Canvas>
          <KillLogs />
        </div>
      )}
      {gameScreen === GameScreen.GAME_OVER && <GameOverPage />}
    </>
  );
};

export default AuthRouter;
