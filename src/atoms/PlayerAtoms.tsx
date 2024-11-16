import { atom } from 'jotai';
import { Character, PlayerMovement } from '../types/player';

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
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    isOnGround: true,
    bodyColor: 'gold',
    hairColor: 'black',
    bellyColor: 'white',
    hasTail: true,
  },
]);
export const playerIdAtom = atom<string | null>('');
