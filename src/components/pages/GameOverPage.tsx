import { useAtom, useAtomValue } from 'jotai';
import { gameScreenAtom } from '../../atoms/GameAtoms';
import { GameScreen } from '../../types/game';
import { playerInfoAtom } from '../../atoms/PlayerAtoms';
import useAudio from '../../hooks/useAudio';
import { useEffect } from 'react';

const GameOverPage = () => {
  const [, setGameScreen] = useAtom(gameScreenAtom);
  const { nickname } = useAtomValue(playerInfoAtom);
  const { setAudioEnabled } = useAudio();

  useEffect(() => {
    setAudioEnabled(false);
  }, []);

  const handlePlayAgain = () => {
    setGameScreen(GameScreen.MATCHING);
  };

  const handleGoHome = () => {
    setGameScreen(GameScreen.HOME);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-5xl font-bold text-white mb-6">게임 오버</h1>

        <div className="space-y-4 mb-8">
          <p className="text-xl text-white/90">{nickname}님 한 판 더?!</p>

          <div className="bg-white/20 rounded-lg p-4">
            <p className="text-lg text-white font-semibold">점수: 100 점</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={handlePlayAgain}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold text-lg"
          >
            다시 하기
          </button>

          <button
            onClick={handleGoHome}
            className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-bold text-lg"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverPage;
