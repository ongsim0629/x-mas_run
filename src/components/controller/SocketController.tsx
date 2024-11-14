import { useAtom } from 'jotai';
import React, { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { playersAtom } from '../../atoms/PlayerAtoms';

const SocketController = () => {
  const socketRef = useRef<Socket | null>(null);
  const [players, setPlayers] = useAtom(playersAtom);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:3001');
    }
    const socket = socketRef.current;
  }, []);
  return <></>;
};

export default SocketController;
