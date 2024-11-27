import { MutableRefObject } from 'react';
import { Position } from '../types/player';
import { RapierRigidBody } from '@react-three/rapier';
import { MathUtils } from 'three/src/math/MathUtils.js';
import { Group } from 'three';
import { isMovingSignificantly, lerpAngle } from '../utils/movementCalc';

type InterpolationProps = {
  currentPosition: MutableRefObject<Position>;
  currentVelocity: MutableRefObject<Position>;
  position: Position;
  velocity: Position;
  rb: MutableRefObject<RapierRigidBody | null>;
  character: MutableRefObject<Group | null>;
};

const usePlayersInterpolation = (props: InterpolationProps) => {
  const updateRemotePosition = (delta: number) => {
    if (!props.rb.current) return;

    const distanceToTarget = Math.sqrt(
      Math.pow(props.currentPosition.current.x - props.position.x, 2) +
        Math.pow(props.currentPosition.current.z - props.position.z, 2),
    );

    if (distanceToTarget > import.meta.env.VITE_DISTANCE_THRESHOLD) {
      props.currentPosition.current = { ...props.position };
      props.currentVelocity.current = { ...props.velocity };
      props.rb.current.setTranslation(props.position, true);
      props.rb.current.setLinvel(props.velocity, true);
    } else {
      const predictPosition = {
        x:
          props.currentPosition.current.x +
          props.currentVelocity.current.x * delta,
        y:
          props.currentPosition.current.y +
          props.currentVelocity.current.y * delta,
        z:
          props.currentPosition.current.z +
          props.currentVelocity.current.z * delta,
      };

      props.currentPosition.current = {
        x: MathUtils.lerp(predictPosition.x, props.position.x, 0.1),
        y: MathUtils.lerp(predictPosition.y, props.position.y, 0.1),
        z: MathUtils.lerp(predictPosition.z, props.position.z, 0.1),
      };

      props.currentVelocity.current = {
        x: MathUtils.lerp(
          props.currentVelocity.current.x,
          props.velocity.x,
          0.1,
        ),
        y: MathUtils.lerp(
          props.currentVelocity.current.y,
          props.velocity.y,
          0.1,
        ),
        z: MathUtils.lerp(
          props.currentVelocity.current.z,
          props.velocity.z,
          0.1,
        ),
      };

      props.rb.current.setTranslation(props.currentPosition.current, true);
      props.rb.current.setLinvel(props.currentVelocity.current, true);
    }

    // 캐릭터 회전 로직 추가
    if (props.character.current && isMovingSignificantly(props.velocity)) {
      const targetAngle = Math.atan2(props.velocity.x, props.velocity.z);
      props.character.current.rotation.y = lerpAngle(
        props.character.current.rotation.y,
        targetAngle,
        0.1,
      );
    }
  };

  return { updateRemotePosition };
};

export default usePlayersInterpolation;
