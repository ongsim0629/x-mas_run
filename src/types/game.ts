import { Character } from './player';

export interface RandomNicknameResponse {
  nickName: string;
}
export enum GameScreen {
  LOADING = 'loading',
  LOGIN = 'login',
  HOME = 'home',
  MATCHING = 'matching',
  GAME = 'game',
  GAME_OVER = 'gameover',
}

export interface RoomInfo {
  roomId: string;
  playerCnt: number;
  state: string;
  maxPlayerCnt: number;
}

export interface GameData {
  remainRunningTime: number;
  characters: Character[];
}

export type Winner = {
  id: string;
  nickName: string;
  charColor: string;
  charType: number;
};
export interface WinnerData {
  character: Winner;
}

export type BGMAudioType = 'bgm' | 'lobby' | 'gameover';
export interface AudioInstance {
  audio: HTMLAudioElement;
  loop: boolean;
}

export type Controls = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  catch: boolean;
  skill: boolean;
};
