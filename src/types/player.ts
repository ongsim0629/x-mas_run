export type Directions = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};
export type Position = { x: number; y: number; z: number };

export interface Character {
  id: string;
  charType: 1 | 2 | 3;
  nickName: string;
  position: Position;
  charColor: string;
  velocity: Position;
  giftCnt: number;
  steal: boolean;
  isBeingStolen: boolean;
  skill: boolean;
}

export interface PlayerMovement {
  steal: boolean;
  skill: boolean;
  character: Pick<Character, 'id' | 'position' | 'velocity'>;
}

export interface PlayerInfo {
  id: string | null | undefined;
  nickname: string;
}
