import { GLTF } from 'three-stdlib';
import * as THREE from 'three';

export type GiftColor = {
  main: string;
};

export const GIFT_COLORS: GiftColor[] = [
  { main: 'red' },
  { main: 'green' },
  { main: 'orange' },
  { main: 'navy' },
  { main: 'pink' },
  { main: 'brown' },
  { main: 'purple' },
] as const;


export type GiftColors = readonly GiftColor[];

export type GLTFGiftResult = GLTF & {
  nodes: {
    Cube_Material002_0: THREE.Mesh;
    Cube001_Material008_0: THREE.Mesh;
    Cube003_Material009_0: THREE.Mesh;
    Cube002_Material010_0: THREE.Mesh;
    Cube004_Material011_0: THREE.Mesh;
    Cube005_Material012_0: THREE.Mesh;
    Sphere_Material023_0: THREE.Mesh;
    Sphere001_Material021_0: THREE.Mesh;
    Sphere002_Material020_0: THREE.Mesh;
    Sphere003_Material019_0: THREE.Mesh;
    Sphere004_Material024_0: THREE.Mesh;
    Sphere005_Material022_0: THREE.Mesh;
    Sphere006_Material015_0: THREE.Mesh;
    Sphere007_Material016_0: THREE.Mesh;
    Sphere008_Material013_0: THREE.Mesh;
    Sphere009_Material014_0: THREE.Mesh;
    Sphere010_Material018_0: THREE.Mesh;
    Sphere011_Material017_0: THREE.Mesh;
  };
  materials: {
    ['Material.002']: THREE.MeshStandardMaterial;
    ['Material.008']: THREE.MeshStandardMaterial;
    ['Material.009']: THREE.MeshStandardMaterial;
    ['Material.010']: THREE.MeshStandardMaterial;
    ['Material.011']: THREE.MeshStandardMaterial;
    ['Material.012']: THREE.MeshStandardMaterial;
    ['Material.023']: THREE.MeshStandardMaterial;
    ['Material.021']: THREE.MeshStandardMaterial;
    ['Material.020']: THREE.MeshStandardMaterial;
    ['Material.019']: THREE.MeshStandardMaterial;
    ['Material.024']: THREE.MeshStandardMaterial;
    ['Material.022']: THREE.MeshStandardMaterial;
    ['Material.015']: THREE.MeshStandardMaterial;
    ['Material.016']: THREE.MeshStandardMaterial;
    ['Material.013']: THREE.MeshStandardMaterial;
    ['Material.014']: THREE.MeshStandardMaterial;
    ['Material.018']: THREE.MeshStandardMaterial;
    ['Material.017']: THREE.MeshStandardMaterial;
  };
};
