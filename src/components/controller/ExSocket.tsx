import { useAtom } from 'jotai';
import React, { useCallback, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { playerIdAtom, playersAtom } from '../../atoms/PlayerAtoms';
import { Character } from '../../types/player';
import { useKeyboardControls } from '@react-three/drei';

interface Directions {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

const MOUSE_SENSITIVITY = 0.002;

const ExSocketController = () => {
  const socketRef = useRef<Socket | null>(null);
  const [players, setPlayers] = useAtom(playersAtom);
  const [playerId, setPlayerId] = useAtom(playerIdAtom);
  const [subscribeKeys, getKeys] = useKeyboardControls();

  // 마우스 회전값 추적
  const angle = useRef(0);

  // 이동 입력 상태 전송
  const sendDirections = useCallback(() => {
    if (!socketRef.current) return;

    const keys = getKeys();
    const directions: Directions = {
      up: keys.forward,
      down: keys.backward,
      left: keys.left,
      right: keys.right,
    };

    socketRef.current.emit('move', directions);
  }, [getKeys]);

  // 소켓 연결 및 이벤트 핸들러 설정
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_DEV_SERVER_URL);
    }
    const socket = socketRef.current;

    const onConnect = () => {
      if (!playerId && socket.id) {
        setPlayerId(socket.id);
      }
    };

    const onDisconnect = () => {
      console.log('Disconnected from server');
    };

    const onPlayers = (updatedPlayers: Character[]) => {
      setPlayers(updatedPlayers);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('characters', onPlayers);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('characters', onPlayers);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [playerId, setPlayerId, setPlayers]);

  // 키보드 입력 처리
  useEffect(() => {
    let movementInterval: number;

    const handleKeyboardControls = (state: any) => {
      const isAnyKeyPressed = 
        state.forward || 
        state.backward || 
        state.left || 
        state.right || 
        state.jump;

      if (isAnyKeyPressed && !movementInterval) {
        // 키가 눌렸고 interval이 없으면 시작
        movementInterval = window.setInterval(sendDirections, 1000 / 60);
        
        // Jump 상태 전송
        if (state.jump) {
          socketRef.current?.emit('jump', true);
        }
      } else if (!isAnyKeyPressed && movementInterval) {
        // 모든 키가 떼어졌고 interval이 있으면 정지
        window.clearInterval(movementInterval);
        movementInterval = 0;
        sendDirections(); // 마지막 상태 전송
        
        // Jump 상태 해제 전송
        socketRef.current?.emit('jump', false);
      }
    };

    // 키보드 상태 구독
    const unsubscribe = subscribeKeys(handleKeyboardControls);

    return () => {
      unsubscribe();
      if (movementInterval) {
        window.clearInterval(movementInterval);
      }
    };
  }, [subscribeKeys, sendDirections]);

  // 마우스 회전 처리
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const isPointerLocked = document.pointerLockElement !== null;
      if (isPointerLocked) {
        angle.current -= event.movementX * MOUSE_SENSITIVITY;
        socketRef.current?.emit('angle', angle.current);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null;
};

export default ExSocketController;