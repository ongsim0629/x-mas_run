export type Directions = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};
export type Position = { x: number; y: number; z: number };

export interface Character {
  id: string;
  nickName: string;
  position: Position;
  bodyColor: string;
  hairColor: string;
  bellyColor: string;
  velocity: Position;
  isOnGround: boolean;
  giftCnt: number;
  shift: boolean;
  isBeingStolen: boolean;
  isSteal: boolean;
}

export interface PlayerMovement {
  shift: boolean;
  character: Pick<Character, 'id' | 'position' | 'velocity' | 'isOnGround'>;
}

export interface PlayerInfo {
  id: string | null | undefined;
  nickname: string;
}
