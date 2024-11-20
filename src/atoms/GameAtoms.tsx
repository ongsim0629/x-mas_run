import { atom } from 'jotai';
import { GameScreen } from '../types/game';
import { SocketService } from '../apis/SocketService';

export const gameScreenAtom = atom<GameScreen>(GameScreen.LOADING);
export const nicknameAtom = atom<string>('');

export const socketServiceAtom = atom<SocketService | null>(null);
export const gameTimeAtom = atom<number | null>(null);
