import { ApiResponse, RandomNicknameResponse } from '../types/game';
import HttpClient from './HttpClient';

export class UserService {
  constructor(private readonly httpClient: HttpClient) {}

  async getRandomNickname(userId: string): Promise<string> {
    const response = await this.httpClient.post<
      ApiResponse<RandomNicknameResponse>
    >('/user/random-nickname', { userId });
    return response.data.nickName;
  }
}
