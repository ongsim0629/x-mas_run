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
  facingAngleRad: number;
}
