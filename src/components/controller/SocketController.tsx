import { useAtom } from 'jotai';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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

  const hasSignificantMovement = useCallback(
    (current: Position, prev: Position): boolean =>
      Math.abs(current.x - prev.x) > import.meta.env.VITE_POSITION_THRESHOLD ||
      Math.abs(current.y - prev.y) > import.meta.env.VITE_POSITION_THRESHOLD ||
      Math.abs(current.z - prev.z) > import.meta.env.VITE_POSITION_THRESHOLD,
    [],
  );

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_DEV_SERVER_URL, {
        reconnection: true,
        reconnectionAttempts: 5,
      });
    }
    const socket = socketRef.current;

    const onConnect = () => {
      if (!playerId && socket.id) {
        setPlayerId(socket.id);
      }
    };

    const onCharacters = (characters: Character[]) => {
      setPlayers(characters);
    };

    const onDisconnect = () => {
      console.log('bye');
      isInitialized.current = false;
    };

    socket.on('connect', onConnect);
    socket.on('characters', onCharacters);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('characters', onCharacters);
      socket.off('disconnect');
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [playerId, setPlayerId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !playerId) return;

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
      });
      prevPosition.current = currentPlayer.position;
    }
  }, [playerId, players, hasSignificantMovement, get]);
  return null;
};

export default SocketController;
