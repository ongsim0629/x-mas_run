import { useAtom, useAtomValue } from 'jotai';
import { gameScreenAtom } from '../atoms/GameAtoms';
import { GameScreen } from '../types/game';
import SocketController from '../controller/SocketController';
import LoadingPage from '../pages/LoadingPage';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import MatchingPage from '../pages/MatchingPage';
import { GameTimer } from '../components/UI/GameTimer';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import GameOverPage from '../pages/GameOverPage';
import { playerInfoAtom } from '../atoms/PlayerAtoms';

const AuthRouter = () => {
  const [gameScreen] = useAtom(gameScreenAtom);
  const { id } = useAtomValue(playerInfoAtom);

  return (
    <>
      {gameScreen === GameScreen.LOADING && <LoadingPage />}
      {id === null ? (
        <>{gameScreen === GameScreen.LOGIN && <LoginPage />}</>
      ) : (
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
              >
                <color attach="background" args={['#0D1B2A']} />
                <Scene />
              </Canvas>
            </div>
          )}
          {gameScreen === GameScreen.GAME_OVER && <GameOverPage />}
        </>
      )}
    </>
  );
};

export default AuthRouter;
