import { Vector3, Object3D } from 'three';
import { GroupProps } from '@react-three/fiber';
import { RapierRigidBody } from '@react-three/rapier';

export interface MapProps extends Omit<GroupProps, 'args'> {
  model: string;
  position?: Vector3 | [number, number, number];
  scale?: Vector3 | [number, number, number] | number;
}

export interface TrainSystem {
  trainMesh: Object3D | null;
  controller: Object3D | null;
  rigidBody: RapierRigidBody | null;
}

export interface TrainMeshes {
  trainA: Object3D | undefined;
  trainB: Object3D | undefined;
  trainC: Object3D | undefined;
}
