export type Directions = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};
export type Position = [number, number, number];

export interface Character {
  id: string;
  position: Position;
  bodyColor: string;
  hairColor: string;
  bellyColor: string;
  velocity: Position;
  isOnGround: boolean;
  hasTail: boolean;
  facingAngleRad?: number;
}
