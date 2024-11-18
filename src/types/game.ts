export interface ApiResponse<T> {
  data: T;
  msg?: string;
}
export interface RandomNicknameResponse {
  nickName: string;
}
export enum GameScreen {
  LOADING = 'loading',
  LOGIN = 'login',
  HOME = 'home',
  MATCHING = 'matching',
  GAME = 'game',
}
