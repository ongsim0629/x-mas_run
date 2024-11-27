import { useFrame } from '@react-three/fiber';
import { RapierRigidBody } from '@react-three/rapier';
import { MutableRefObject } from 'react';
import { Position } from '../types/player';
import { Camera } from 'three';

type Controls = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  catch: boolean;
};

type GameLoopProps = {
  isLocalPlayer?: boolean;
  rb: MutableRefObject<RapierRigidBody | null>;
  getControls: () => Controls;
  updateMovement: (
    controls: Controls,
    rigidBody: RapierRigidBody,
    isOnGround: boolean,
  ) => { velocity: Position };
  updatePlayerState: (position: Position, velocity: Position) => void;
  updateCamera: (camera: Camera, isOnGround: boolean) => void;
  updateRemotePosition: (delta: number) => void;
  updateAnimation: (velocity: Position) => void;
  velocity: Position;
};
const useGameLoop = (props: GameLoopProps) => {
  useFrame(({ camera }, delta) => {
    if (props.rb.current) {
      if (props.isLocalPlayer) {
        const pos = props.rb.current.translation();
        const isOnGround = Math.abs(props.rb.current.linvel().y) < 0.1;

        const controls = props.getControls();
        const { velocity: vel } = props.updateMovement(
          controls,
          props.rb.current,
          isOnGround,
        );
        props.updatePlayerState(pos, vel);
        props.updateCamera(camera, isOnGround);
      } else {
        props.updateRemotePosition(delta);
        props.updateAnimation(props.velocity);
      }
    }
  });
};
export default useGameLoop;
