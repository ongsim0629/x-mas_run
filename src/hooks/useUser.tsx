import React from 'react';
import HttpClient from '../apis/HttpClient';
import { UserService } from '../apis/UserService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useUser = () => {
  const httpClient = new HttpClient();
  const users = new UserService(httpClient);
  const queryClient = useQueryClient();

  const { mutateAsync: nicknameQuery } = useMutation({
    mutationFn: (userId: string) => users.getRandomNickname(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userId'] }),
  });
  return { nicknameQuery };
};

export default useUser;
