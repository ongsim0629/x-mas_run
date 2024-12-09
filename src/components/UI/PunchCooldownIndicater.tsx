import { useAtomValue } from 'jotai';
import { animationRefsAtom } from '../../atoms/PlayerAtoms';
import { useState, useEffect } from 'react';

const PUNCH_COOLDOWN = 500;

const PunchCooldownIndicator = () => {
  const animRefs = useAtomValue(animationRefsAtom);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(true);

  useEffect(() => {
    let animationFrameId: number;

    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - animRefs.lastPunchTime;

      if (elapsed >= PUNCH_COOLDOWN) {
        setProgress(0);
        setIsReady(true);
        return;
      }

      const remaining = PUNCH_COOLDOWN - elapsed;
      const newProgress = (remaining / PUNCH_COOLDOWN) * 100;

      setProgress(newProgress);
      setIsReady(false);

      animationFrameId = requestAnimationFrame(updateProgress);
    };

    if (animRefs.isPunching || animRefs.lastPunchTime > 0) {
      updateProgress();
    } else {
      setProgress(0);
      setIsReady(true);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [animRefs.lastPunchTime, animRefs.isPunching]);

  const remainingPercent = Math.round(progress);

  return (
    <div className="fixed bottom-8 right-28 flex flex-col items-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-gray-300 opacity-90" />
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 transform"
          viewBox="0 0 100 100"
        >
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
          <circle
            className={`${isReady ? 'text-purple-500' : 'text-gray-400'}`}
            strokeWidth="8"
            strokeDasharray={264}
            strokeDashoffset={264 * (progress / 100)}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/images/punch.svg"
            alt="선물 뺏기"
            className={`w-8 h-8 ${isReady ? 'opacity-100' : 'opacity-40'}`}
          />
        </div>
      </div>

      <div
        className={`mt-2 font-bold ${isReady ? 'text-purple-500' : 'text-gray-400'}`}
      >
        선물 뺏기
      </div>

      <div className={isReady ? 'text-black' : 'text-gray-400'}>
        {isReady ? '사용 가능' : `${remainingPercent}%`}
      </div>

      <div className="mt-1 px-2 py-0.5 bg-gray-800 rounded text-sm text-gray-300">
        클릭 or 쉬프트
      </div>
    </div>
  );
};

export default PunchCooldownIndicator;
