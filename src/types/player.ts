export type Directions = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};
export type Position = { x: number; y: number; z: number };

export interface Character {
  id: string;
  position: Position;
  bodyColor: string;
  hairColor: string;
  bellyColor: string;
  velocity: Position;
  isOnGround: boolean;
  hasTail: boolean;
}

export interface PlayerMovement {
  shift: boolean;
  character: Pick<Character, 'id' | 'position' | 'velocity' | 'isOnGround'>;
}

export interface PlayerInfo {
  id: string | null | undefined;
  nickname: string;
}
