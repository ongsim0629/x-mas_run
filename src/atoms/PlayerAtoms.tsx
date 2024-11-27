import { atom } from 'jotai';
import { Character, PlayerInfo, PlayerMovement } from '../types/player';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export const playerMovementAtom = atom<PlayerMovement>({
  steal: false,
  skill: false,
  character: {
    id: '',
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
  },
});
export const playersAtom = atom<Character[]>([
  {
    id: '',
    charType: 0,
    nickName: 'ONGSIM',
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    charColor: 'gold',
    giftCnt: 0,
    steal: false,
    isBeingStolen: false,
    skill: false,
  },
]);

export const playerInfoAtom = atomWithStorage<PlayerInfo>(
  'player',
  { id: null, nickname: '' },
  createJSONStorage(() => sessionStorage),
);
