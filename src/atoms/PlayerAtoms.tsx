import { atom } from 'jotai';
import { Character, PlayerInfo, PlayerMovement } from '../types/player';

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
    giftCnt: 0,
    shift: false,
    isBeingStolen: false,
    isSteal: false,
  },
]);

export const playerInfoAtom = atom<PlayerInfo>({ id: null, nickname: '' });
