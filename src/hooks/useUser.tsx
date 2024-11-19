import React from 'react';
import HttpClient from '../apis/HttpClient';
import { UserService } from '../apis/UserService';
import { useQuery } from '@tanstack/react-query';

const useUser = () => {
  const httpClient = new HttpClient();
  const users = new UserService(httpClient);

  const { data: nicknameQuery } = useQuery({
    queryFn: () => users.getRandomNickname(),
    queryKey: ['userId'],
  });
  return { nicknameQuery };
};

export default useUser;
