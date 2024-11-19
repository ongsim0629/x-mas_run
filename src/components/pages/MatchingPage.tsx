import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { gameScreenAtom } from '../../atoms/GameAtoms';
import { GameScreen } from '../../types/game';
import useSocket from '../../hooks/useSocket';
import { playerInfoAtom } from '../../atoms/PlayerAtoms';

const MatchingPage = () => {
  const [playerCount, setPlayerCount] = useState(1);
  const [, setGameScreen] = useAtom(gameScreenAtom);
  const { nickname } = useAtomValue(playerInfoAtom);
  const socket = useSocket();
  const effectExecutionRef = useRef(false);

  useEffect(() => {
    if (effectExecutionRef.current) return;
    if (!socket) return;
    console.log('Effect 실행 - socket ID:', socket.id);
    effectExecutionRef.current = true;
    socket.enterRoom();
    const unsubscribeRoomSate = socket.onRoomStateChange((roomInfo) => {
      setPlayerCount(roomInfo.playerCnt);
    });
    const unsubscribeGameStart = socket.onGameStart(() => {
      setGameScreen(GameScreen.GAME);
    });

    return () => {
      console.log('Effect 정리 - socket ID:', socket.id);
      effectExecutionRef.current = false;
      unsubscribeRoomSate();
      unsubscribeGameStart();
    };
  }, [socket, setGameScreen]);

  const handleLeave = useCallback(() => {
    if (!socket) return;
    socket.leaveRoom();
    setGameScreen(GameScreen.HOME);
  }, [socket, setGameScreen]);

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
