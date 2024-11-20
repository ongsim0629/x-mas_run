import { useEffect } from 'react';
import { SocketService } from '../apis/SocketService';
import { useAtom, useAtomValue } from 'jotai';
import { socketServiceAtom } from '../atoms/GameAtoms';
import { playerInfoAtom } from '../atoms/PlayerAtoms';

const useSocket = () => {
  const [socket, setSocket] = useAtom(socketServiceAtom);
  const { id } = useAtomValue(playerInfoAtom);

  useEffect(() => {
    if (socket || !id) return;

    const socketService = new SocketService(id);

    socketService.onConnect(() => {
      // 이건 소켓 디버깅이 완료되면 추후에 빼겠습니다!
      console.log('usSocket에서 연결된 생태: ', socketService.id);
    });
    setSocket(socketService);
  }, []);

  return socket;
};

export default useSocket;
