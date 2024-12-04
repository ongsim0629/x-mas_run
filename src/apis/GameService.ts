import { GameRankData } from '../types/game';
import { MyGameResult, PlayerInfo } from '../types/player';
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

  async getTotalGameResult(roomId: string): Promise<GameRankData> {
    const response = await this.httpClient.get<GameRankData>(
      '/game/summary/total-rank',
      {},
      { roomId },
    );
    return response;
  }

  async getMyGameResult(roomId: string, userId: string): Promise<MyGameResult> {
    const response = await this.httpClient.get<MyGameResult>(
      '/game/summary/personal',
      {},
      { roomId, userId },
    );
    return response;
  }
}
