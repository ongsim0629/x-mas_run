import React from 'react';
import HttpClient from '../apis/HttpClient';
import { UserService } from '../apis/UserService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const useUser = () => {
  const httpClient = new HttpClient();
  const users = new UserService(httpClient);

  return {};
};

export default useUser;
