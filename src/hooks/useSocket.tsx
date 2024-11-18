import React, { useEffect, useRef } from 'react';
import { SocketService } from '../apis/SocketService';
import SocketClient from '../apis/SocketClient';

const useSocket = () => {
  const socketRef = useRef<SocketService | null>(null);
  useEffect(() => {
    if (!socketRef.current) {
      const socketClient = new SocketClient();
      socketRef.current = new SocketService(socketClient);
    }
    return () => {
      if (socketRef.current) {
        const socket = (socketRef.current as any).socket;
        socket.disconnect();
      }
    };
  }, []);
  return socketRef;
};

export default useSocket;
