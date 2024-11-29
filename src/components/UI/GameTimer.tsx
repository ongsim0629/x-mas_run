import { useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  gameScreenAtom,
  gameTimeAtom,
  playAudioAtom,
  roomIdAtom,
} from '../../atoms/GameAtoms';
import { GameScreen } from '../../types/game';
import useSocket from '../../hooks/useSocket';

export const GameTimer = () => {
  const [, playAudio] = useAtom(playAudioAtom);
  const timeLeft = useAtomValue(gameTimeAtom);
  const setGameScreen = useSetAtom(gameScreenAtom);
  const { socket } = useSocket();
  const setRoomId = useSetAtom(roomIdAtom);

  useEffect(() => {
    if (timeLeft !== null && timeLeft <= 10 && timeLeft > 0) {
      playAudio('beep1');
    }
  }, [timeLeft, playAudio]);

  useEffect(() => {
    if (socket) {
      const unsubscribe = socket.onGameOver(
        ({ roomId }: { roomId: string }) => {
          setRoomId(roomId);
          setGameScreen(GameScreen.GAME_OVER);
        },
      );
      return () => {
        unsubscribe();
      };
    }
  }, [socket, setRoomId, setGameScreen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {timeLeft && (
        <>
          {timeLeft > 10 ? (
            <div className="absolute top-4 pl-10 z-50">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-2">
                <div
                  className="text-white font-bold text-2xl"
                  aria-label="remaining-time"
                >
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-timer-scale absolute top-20 left-1/2 -translate-x-1/2 text-3xl z-50 w-20 h-20 bg-2-xmas-red text-white flex justify-center items-center rounded-full font-bold">
              {timeLeft}
            </div>
          )}
        </>
      )}
    </>
  );
};
