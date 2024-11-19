import React, { useEffect } from 'react';
import { atom, useAtom } from 'jotai';

// 게임 시간을 위한 atom
export const gameTimeAtom = atom(10); // 3분

export const GameTimer = () => {
  const [timeLeft, setTimeLeft] = useAtom(gameTimeAtom);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-4 pl-10 z-50">
      <div className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-2">
        <div className="text-white font-bold text-2xl">
          {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  );
};
