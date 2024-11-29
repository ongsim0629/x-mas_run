import { Winner, WinnerData } from '../types/game';
import { PlayerInfo } from '../types/player';
import HttpClient from './HttpClient';

export default class GameService {
  constructor(private readonly httpClient: HttpClient) {}
  async registerPlayer(playerInfo: PlayerInfo): Promise<string> {
    const response = await this.httpClient.post<{ userId: string }>(
      '/user/enter',
      { userId: playerInfo.id, nickName: playerInfo.nickname },
    );
    return response.userId;
  }

  async getTotalGameResult(roomId: string): Promise<Winner> {
    const response = await this.httpClient.get<WinnerData>(
      '/game/summary/total',
      {},
      { roomId },
    );
    return response.character;
  }
}
