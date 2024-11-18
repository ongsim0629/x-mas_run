import React from 'react';
import HttpClient from '../apis/HttpClient';
import { UserService } from '../apis/UserService';
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
  return { registerPlayerQuery };
};

export default useGame;
