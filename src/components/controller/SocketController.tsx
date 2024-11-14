import React, { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketController = () => {
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:3001');
    }
    const socket = socketRef.current;
  }, []);
  return <></>;
};

export default SocketController;
