import { useFrame } from '@react-three/fiber';
import { RapierRigidBody } from '@react-three/rapier';
import { MutableRefObject } from 'react';
import { Position } from '../types/player';
import { Camera } from 'three';

type GameLoopProps = {
  isLocalPlayer?: boolean;
  rb: MutableRefObject<RapierRigidBody | null>;
  updateMovement: (rigidBody: RapierRigidBody) => void;
  updatePlayerState: (position: Position, velocity: Position) => void;
  updateCamera: (camera: Camera, isOnGround: boolean) => void;
  updateRemotePosition: (delta: number) => void;
  updateAnimation: (velocity: Position) => void;
  velocity: Position;
  speedMultiplier?: number;
};
const useGameLoop = (props: GameLoopProps) => {
  useFrame(({ camera }, delta) => {
    if (props.rb.current) {
      if (props.isLocalPlayer) {
        const isOnGround = Math.abs(props.rb.current.linvel().y) < 0.1;
        props.updateMovement(props.rb.current);
        props.updateCamera(camera, isOnGround);
      } else {
        props.updateRemotePosition(delta);
        props.updateAnimation(props.velocity);
      }
    }
  });
};
export default useGameLoop;
