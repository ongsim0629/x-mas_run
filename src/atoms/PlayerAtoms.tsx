import { atom } from 'jotai';
import { Character, PlayerInfo, PlayerMovement } from '../types/player';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export const playerMovementAtom = atom<PlayerMovement>({
  shift: false,
  character: {
    id: '',
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    isOnGround: true,
  },
});
export const playersAtom = atom<Character[]>([
  {
    id: '',
    nickName: 'ONGSIM',
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    isOnGround: true,
    bodyColor: 'gold',
    hairColor: 'black',
    bellyColor: 'white',
    hasTail: true,
  },
]);

export const playerInfoAtom = atomWithStorage<PlayerInfo>(
  'player',
  { id: null, nickname: '' },
  createJSONStorage(() => sessionStorage),
);
