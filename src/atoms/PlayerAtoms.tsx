import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Character } from '../types/player';

export const playersAtom = atom<Character[]>([]);
export const playerIdAtom = atomWithStorage('playerId', null);
