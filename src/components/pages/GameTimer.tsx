import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { gameScreenAtom, gameTimeAtom } from '../../atoms/GameAtoms';
import { GameScreen } from '../../types/game';
import useAudio from '../../hooks/useAudio';

export const GameTimer = () => {
  const { setAudioEnabled } = useAudio();
  const timeLeft = useAtomValue(gameTimeAtom);
  const setGameScreen = useSetAtom(gameScreenAtom);

  useEffect(() => {
    setAudioEnabled(true);
    if (timeLeft !== null && timeLeft <= 1) {
      setAudioEnabled(false);
      setGameScreen(GameScreen.GAME_OVER);
    }
  }, [timeLeft, setAudioEnabled]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-4 pl-10 z-50">
      <div className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-2">
        {timeLeft && (
          <div className="text-white font-bold text-2xl">
            {formatTime(timeLeft)}
          </div>
        )}
      </div>
    </div>
  );
};
