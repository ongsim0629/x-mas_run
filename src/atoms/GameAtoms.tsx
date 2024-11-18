import { atom } from 'jotai';
import { GameScreen } from '../types/game';

export const gameScreenAtom = atom<GameScreen>(GameScreen.LOADING);
export const nicknameAtom = atom<string>('');