import React, { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { gameScreenAtom, gameTimeAtom } from '../../atoms/GameAtoms';
import { GameScreen } from '../../types/game';

export const GameTimer = () => {
  const timeLeft = useAtomValue(gameTimeAtom);
  const setGameScreen = useSetAtom(gameScreenAtom);

  useEffect(() => {
    if (timeLeft !== null && timeLeft <= 0) {
      setGameScreen(GameScreen.GAME_OVER);
    }
  }, [timeLeft]);

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
