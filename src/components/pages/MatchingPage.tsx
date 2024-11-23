import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { gameScreenAtom, playAudioAtom } from '../../atoms/GameAtoms';
import { GameScreen } from '../../types/game';
import useSocket from '../../hooks/useSocket';
import { playerInfoAtom } from '../../atoms/PlayerAtoms';
import Star, { generateStars } from './Star';
import KeyboardGuide from './KeyboardGuide';

interface RoomInfo {
  playerCnt: number;
}

interface Meteor {
  id: number;
  startX: number;
  startY: number;
}

const MatchingPage = () => {
  const [playerCount, setPlayerCount] = useState<number>(1);
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [, setGameScreen] = useAtom(gameScreenAtom);
  const { nickname } = useAtomValue(playerInfoAtom);
  const [, playAudio] = useAtom(playAudioAtom);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.enterRoom();
    const unsubscribeRoomState = socket.onRoomStateChange(
      (roomInfo: RoomInfo) => {
        setPlayerCount(roomInfo.playerCnt);
      },
    );
    const unsubscribeGameStart = socket.onGameStart(() => {
      setGameScreen(GameScreen.GAME);
    });

    return () => {
      unsubscribeRoomState();
      unsubscribeGameStart();
    };
  }, [socket, setGameScreen, setPlayerCount]);

  const handleLeave = useCallback(() => {
    if (!socket) return;
    socket.leaveRoom();
    setGameScreen(GameScreen.HOME);
  }, [socket, setGameScreen]);

  const createMeteor = (e: React.MouseEvent<HTMLDivElement>) => {
    playAudio('twinkle');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newMeteor: Meteor = {
      id: Date.now(),
      startX: x,
      startY: y,
    };

    setMeteors((prev) => [...prev, newMeteor]);

    setTimeout(() => {
      setMeteors((prev) => prev.filter((meteor) => meteor.id !== newMeteor.id));
    }, 2000);
  };

  const stars = useMemo(() => generateStars(20), []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-black via-purple-950 to-blue-950"
      onClick={createMeteor}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 20px 30px, #FFD700, rgba(0,0,0,0)), ' +
            'radial-gradient(1px 1px at 40px 70px, #FF69B4, rgba(0,0,0,0)), ' +
            'radial-gradient(1px 1px at 50px 160px, #87CEEB, rgba(0,0,0,0)), ' +
            'radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)), ' +
            'radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0)), ' +
            'radial-gradient(1px 1px at 160px 120px, #fff, rgba(0,0,0,0))',
          backgroundSize: '200px 200px',
        }}
      />
      {stars.map((star) => (
        <Star key={star.id} star={star} />
      ))}
      {meteors.map((meteor) => (
        <div
          key={meteor.id}
          className="absolute animate-shooting-star"
          style={{
            top: meteor.startY,
            left: meteor.startX,
          }}
        >
          <div className="w-2 h-2 bg-white rounded-full" />
          <div className="absolute w-40 h-1 -right-40 top-1/2 -translate-y-1/2 bg-gradient-to-l from-transparent to-white opacity-40" />
        </div>
      ))}

      <div className="relative z-10 flex flex-col gap-10 text-white justify-center items-center w-full h-full">
        <KeyboardGuide />
        <div className="flex items-end">
          <span className="font-semibold text-2xl">{playerCount}</span>
          <span className="ml-2">명 접속중...🐰</span>
        </div>
      </div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-opacity-50 text-sm">
        {nickname}님 클릭해서 별똥별을 만들어보세요 ✨
      </div>
    </div>
  );
};

export default MatchingPage;
