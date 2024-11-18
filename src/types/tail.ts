export interface EffectConfig {
  COUNT: number;
  RADIUS: number;
  COLOR?: string;
  TEXTURE: string;
  SCALE: {
    START: number;
    END: number;
  };
  DURATION: {
    MIN: number;
    MAX: number;
  };
}

export interface CreateSpriteProps {
  texture: THREE.Texture;
  opacity?: number;
  color?: string;
  blending?: THREE.Blending;
  fog?: boolean;
}

export interface AnimateSpriteProps {
  sprite: THREE.Sprite;
  position: {
    x: number;
    y: number;
    z: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
  duration: number;
  onComplete: () => void;
}
