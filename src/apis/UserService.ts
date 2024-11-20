import { RandomNicknameResponse } from '../types/game';
import HttpClient from './HttpClient';

export class UserService {
  constructor(private readonly httpClient: HttpClient) {}

  async getRandomNickname(): Promise<string> {
    const response = await this.httpClient.get<RandomNicknameResponse>(
      '/user/random-nickname',
    );
    return response.nickName;
  }
}
