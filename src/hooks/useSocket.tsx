import React, { useEffect } from 'react';
import { SocketService } from '../apis/SocketService';
import { useAtom } from 'jotai';
import { socketServiceAtom } from '../atoms/GameAtoms';

const useSocket = () => {
  const [socket, setSocket] = useAtom(socketServiceAtom);

  useEffect(() => {
    if (socket) return;

    const socketService = new SocketService();

    socketService.onConnect(() => {
      console.log('usSocket에서 연결된 생태: ', socketService.id);
    });
    setSocket(socketService);
  }, []);

  return socket;
};

export default useSocket;
