import { useAtom } from 'jotai';
import React, { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { playerIdAtom, playersAtom } from '../../atoms/PlayerAtoms';
import { Character } from '../../types/player';
import { useKeyboardControls } from '@react-three/drei';

const SocketController = () => {
  const socketRef = useRef<Socket | null>(null);
  const [players, setPlayers] = useAtom(playersAtom);
  const [playerId, setPlayerId] = useAtom(playerIdAtom);
  const [, get] = useKeyboardControls();

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
      console.log('bye');
    };

    const onPlayers = (players: Character[]) => {
      setPlayers(players);
    };

    const moveCharacter = () => {
      let direction = {
        up: false,
        down: false,
        left: false,
        right: false,
      };
      if (get().forward) direction.up = true;
      if (get().backward) direction.down = true;
      if (get().left) direction.left = true;
      if (get().right) direction.right = true;

      if (direction) socket.emit('move', { direction });
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('characters', onPlayers);
    document.addEventListener('keydown', moveCharacter);
    document.addEventListener('keyup', moveCharacter);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('characters', onPlayers);
      socketRef.current?.disconnect();
      socketRef.current = null;
      document.removeEventListener('keydown', moveCharacter);
      document.removeEventListener('keyup', moveCharacter);
    };
  }, []);
  return null;
};

export default SocketController;
