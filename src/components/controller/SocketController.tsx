import { useAtom } from 'jotai';
import React, { useCallback, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { playerIdAtom, playersAtom } from '../../atoms/PlayerAtoms';
import { Character, Position } from '../../types/player';
import { useKeyboardControls } from '@react-three/drei';

const SocketController = () => {
  const socketRef = useRef<Socket | null>(null);
  const prevPosition = useRef<Position>({ x: 0, y: 0, z: 0 });
  const [players, setPlayers] = useAtom(playersAtom);
  const [playerId, setPlayerId] = useAtom(playerIdAtom);
  const isInitialized = useRef(false);
  const [, get] = useKeyboardControls();

  // 소켓 연결 설정
  useEffect(() => {
    let isMounted = true;

    const initializeSocket = () => {
      try {
        // 기존 소켓이 있다면 정리
        if (socketRef.current) {
          socketRef.current.removeAllListeners();
          socketRef.current.disconnect();
          socketRef.current = null;
        }

        // 새로운 소켓 연결
        const socket = io(import.meta.env.VITE_DEV_SERVER_URL, {
          transports: ['websocket'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 3,
        });

        socket.on('connect', () => {
          if (!isMounted) return;
          if (socket.id) {
            setPlayerId(socket.id);
          }
        });

        socket.on('characters', (updatedPlayers: Character[]) => {
          if (!isMounted) return;
          setPlayers(updatedPlayers);
        });

        socket.on('disconnect', () => {
          if (!isMounted) return;
          console.log('Bye~👻');
          isInitialized.current = false;
        });

        socketRef.current = socket;
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    };

    initializeSocket();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        console.log('Cleaning up socket connection');
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket?.connected || !playerId) return;

    const currentPlayer = players.find((p) => p.id === playerId);
    if (!currentPlayer) return;

    if (!isInitialized.current) {
      prevPosition.current = currentPlayer.position;
      isInitialized.current = true;
      return;
    }

    if (hasSignificantMovement(currentPlayer.position, prevPosition.current)) {
      socket.emit('move', {
        character: currentPlayer,
        shift: get().catch,
        timestamp: Date.now(),
      });
      prevPosition.current = currentPlayer.position;
    }
  }, [playerId, players, get]);

  const hasSignificantMovement = useCallback(
    (current: Position, prev: Position): boolean =>
      Math.abs(current.x - prev.x) > import.meta.env.VITE_POSITION_THRESHOLD ||
      Math.abs(current.y - prev.y) > import.meta.env.VITE_POSITION_THRESHOLD ||
      Math.abs(current.z - prev.z) > import.meta.env.VITE_POSITION_THRESHOLD,
    [],
  );

  return null;
};

export default SocketController;
