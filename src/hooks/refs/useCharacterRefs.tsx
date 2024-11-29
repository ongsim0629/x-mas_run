import { RapierRigidBody } from '@react-three/rapier';
import { Position } from '../../types/player';
import { useEffect, useRef } from 'react';
import { Group } from 'three';

const useCharacterRefs = (position: Position, velocity: Position) => {
  const rb = useRef<RapierRigidBody>(null);
  const container = useRef<Group>(null);
  const character = useRef<Group>(null);
  const isInitialized = useRef(false);
  const currentPosition = useRef(position);
  const currentVelocity = useRef(velocity);
  const lastServerPosition = useRef(position);

  useEffect(() => {
    if (!isInitialized.current && rb.current) {
      currentPosition.current = position;
      currentVelocity.current = velocity;
      rb.current.setTranslation(position, true);
      rb.current.setLinvel(velocity, true);
      isInitialized.current = true;
    }
  }, []);

  return {
    rb,
    container,
    character,
    currentPosition,
    currentVelocity,
    lastServerPosition,
  };
};
export default useCharacterRefs;
