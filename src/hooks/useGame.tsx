import HttpClient from '../apis/HttpClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import GameService from '../apis/GameService';
import { PlayerInfo } from '../types/player';

const useGame = () => {
  const httpClient = new HttpClient();
  const game = new GameService(httpClient);
  const queryClient = useQueryClient();

  const { mutateAsync: registerPlayerQuery } = useMutation({
    mutationFn: (playerInfo: PlayerInfo) => game.registerPlayer(playerInfo),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['playerInfo'] }),
  });

  const { mutateAsync: winnerQuery } = useMutation({
    mutationFn: (roomId: string) => game.getTotalGameResult(roomId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['winnerInfo'] }),
  });

  const { mutateAsync: myGameResultQuery } = useMutation({
    mutationFn: ({ roomId, userId }: { roomId: string; userId: string }) =>
      game.getMyGameResult(roomId, userId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['myGameInfo'] }),
  });
  return { registerPlayerQuery, winnerQuery, myGameResultQuery };
};

export default useGame;
