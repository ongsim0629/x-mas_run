import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { gameScreenAtom } from '../../atoms/GameAtoms';
import { GameScreen } from '../../types/game';
import { playerInfoAtom } from '../../atoms/PlayerAtoms';
import useUser from '../../hooks/useUser';

const LoadingPage = () => {
  const setGameScreen = useSetAtom(gameScreenAtom);
  const setPlayer = useSetAtom(playerInfoAtom);
  const { nicknameQuery } = useUser();

  useEffect(() => {
    if (nicknameQuery) {
      setPlayer((prev) => ({ ...prev, nickname: nicknameQuery }));
      setGameScreen(GameScreen.LOGIN);
    }
  }, [nicknameQuery]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Loading Game...</h1>
        <div className="w-32 h-32 relative">
          <div className="absolute inset-0 border-t-4 border-blue-200 border-solid rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
