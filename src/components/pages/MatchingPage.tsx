import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { gameScreenAtom, nicknameAtom } from '../../atoms/GameAtoms';
import { GameScreen } from '../../types/game';
import { useSocket } from '../context/socketContext';

const MatchingPage = () => {
  const [playerCount, setPlayerCount] = useState(1);
  const [, setGameScreen] = useAtom(gameScreenAtom);
  const nickname = useAtomValue(nicknameAtom);
  const socket = useSocket();

  useEffect(() => {
    // 대기실 입장
    socket.emit('room.enter');

    // 대기실 상태 변경 수신
    socket.on('room.changeState', (data: { playerCnt: number }) => {
      setPlayerCount(data.playerCnt);
    });

    // 게임 시작 신호 수신
    socket.on('game.start', () => {
      setGameScreen(GameScreen.GAME);
    });

    return () => {
      socket.emit('room.leave');
      socket.off('room.changeState');
      socket.off('game.start');
    };
  }, [socket, setGameScreen]);

  const handleLeave = () => {
    socket.emit('room.leave');
    setGameScreen(GameScreen.HOME);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-white mb-4">대기실</h2>

        <div className="space-y-4">
          <div className="text-white">
            <p className="mb-2">닉네임: {nickname}</p>
            <p>현재 인원: {playerCount}명</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleLeave}
              className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              나가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingPage;
