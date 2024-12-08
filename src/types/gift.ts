import { GLTF } from 'three-stdlib';
import {
  Blending,
  Mesh,
  MeshStandardMaterial,
  Sprite,
  Texture,
  Vector3,
} from 'three';

export interface EffectConfig {
  COUNT: number;
  RADIUS: number;
  HEIGHT: number;
  COLOR: string;
  SCALE: {
    START: number;
    END: number;
  };
  DURATION: {
    MIN: number;
    MAX: number;
  };
  LOOPS: number;
}

export interface CreateSpriteProps {
  texture: Texture;
  color?: string;
  opacity?: number;
  blending?: Blending;
}

export interface AnimateSpriteProps {
  sprite: Sprite;
  startPosition: Vector3;
  endPosition: Vector3;
  startScale: number;
  endScale: number;
  duration: number;
  delay?: number;
}

export interface GiftColor {
  main: string;
}

export const GIFT_COLORS: readonly GiftColor[] = [
  { main: 'red' },
  { main: 'green' },
  { main: 'orange' },
  { main: 'navy' },
  { main: 'pink' },
  { main: 'brown' },
  { main: 'purple' },
] as const;

export type GLTFGiftResult = GLTF & {
  nodes: {
    Cube_Material002_0: Mesh;
    Cube001_Material008_0: Mesh;
    Cube003_Material009_0: Mesh;
    Cube002_Material010_0: Mesh;
    Cube004_Material011_0: Mesh;
    Cube005_Material012_0: Mesh;
    Sphere_Material023_0: Mesh;
    Sphere001_Material021_0: Mesh;
    Sphere002_Material020_0: Mesh;
    Sphere003_Material019_0: Mesh;
    Sphere004_Material024_0: Mesh;
    Sphere005_Material022_0: Mesh;
    Sphere006_Material015_0: Mesh;
    Sphere007_Material016_0: Mesh;
    Sphere008_Material013_0: Mesh;
    Sphere009_Material014_0: Mesh;
    Sphere010_Material018_0: Mesh;
    Sphere011_Material017_0: Mesh;
  };
  materials: {
    ['Material.002']: MeshStandardMaterial;
    ['Material.008']: MeshStandardMaterial;
    ['Material.009']: MeshStandardMaterial;
    ['Material.010']: MeshStandardMaterial;
    ['Material.011']: MeshStandardMaterial;
    ['Material.012']: MeshStandardMaterial;
    ['Material.023']: MeshStandardMaterial;
    ['Material.021']: MeshStandardMaterial;
    ['Material.020']: MeshStandardMaterial;
    ['Material.019']: MeshStandardMaterial;
    ['Material.024']: MeshStandardMaterial;
    ['Material.022']: MeshStandardMaterial;
    ['Material.015']: MeshStandardMaterial;
    ['Material.016']: MeshStandardMaterial;
    ['Material.013']: MeshStandardMaterial;
    ['Material.014']: MeshStandardMaterial;
    ['Material.018']: MeshStandardMaterial;
    ['Material.017']: MeshStandardMaterial;
  };
};
