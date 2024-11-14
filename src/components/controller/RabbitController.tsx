import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import React, { useCallback, useRef, useState } from 'react';
import { AnimatedRabbit, RabbitActionName } from '../models/AnimatedRabbit';
import { useControls } from 'leva';
import { degToRad, MathUtils } from 'three/src/math/MathUtils.js';
import { Group, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';

const RabbitController = () => {
  const { SPEED, ROTATION_SPEED } = useControls('Rabbit Control', {
    SPEED: { value: 1.6, min: 0.2, max: 12, step: 0.1 },
    ROTATION_SPEED: {
      value: degToRad(0.5),
      min: degToRad(0.1),
      max: degToRad(5),
      step: degToRad(0.1),
    },
  });
  const [animation, setAnimation] = useState<RabbitActionName>(
    'CharacterArmature|Idle'
  );
  const rb = useRef<RapierRigidBody>();
  const container = useRef<Group>();
  const character = useRef<Group>();

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0); // 실제
  const cameraTarget = useRef<Group>();
  const cameraPosition = useRef<Group>(); // 그룹 내에서의 상대적 위치
  const cameraLookAtWorldPosition = useRef(new Vector3()); // cameraTarget의 절대 위치
  const cameraWorldPosition = useRef(new Vector3()); // cameraPosition의 절대 위치
  const cameraLookAt = useRef(new Vector3()); // 부드럽게 해당 위치로 회전하기 위한 Ref

  const [, get] = useKeyboardControls();

  const normalizeAngle = useCallback((angle: any) => {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
  }, []);
  const lerpAngle = useCallback((start: any, end: any, t: any) => {
    start = normalizeAngle(start);
    end = normalizeAngle(end);

    if (Math.abs(end - start) > Math.PI) {
      if (end > start) start += 2 * Math.PI;
      else end += 2 * Math.PI;
    }
    return normalizeAngle(start + (end - start) * t);
  }, []);

  useFrame(({ camera }) => {
    if (rb.current) {
      // 직선 운동 속도
      const vel = rb.current.linvel();

      const movement = {
        x: 0,
        y: 0,
        z: 0,
      };

      if (get().forward) movement.z = 1;
      if (get().backward) movement.z = -1;
      if (get().left) movement.x = 1;
      if (get().right) movement.x = -1;
      if (get().jump) movement.y = 1;

      if (movement.x !== 0) {
        // 전체 회전
        rotationTarget.current += ROTATION_SPEED * movement.x;
      }

      if (movement.x !== 0 || movement.z !== 0) {
        // 각도를 구해서 캐릭터 회전을 더함
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          SPEED;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          SPEED;
        setAnimation('CharacterArmature|Run');
      } else {
        setAnimation('CharacterArmature|Idle');
      }

      if (character.current) {
        character.current.rotation.y = lerpAngle(
          character.current.rotation.y,
          characterRotationTarget.current,
          0.1
        );
      }

      rb.current.setLinvel(vel, true);
    }

    if (container.current) {
      container.current.rotation.y = MathUtils.lerp(
        container.current.rotation.y,
        rotationTarget.current,
        0.1
      );
    }

    // Vector3 실행을 반복하지 않기 위해 나눠서 진행
    cameraPosition.current?.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);

    cameraTarget.current?.getWorldPosition(cameraLookAtWorldPosition.current);
    // 부드러운 회전을 위한 중간값 지정
    cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
    camera.lookAt(cameraLookAt.current);
  });

  return (
    // 충돌 감지 비활성화: Capsule 쓰기 위해서, lockRotations: 안넘어지게
    <RigidBody colliders={false} lockRotations ref={rb}>
      {/* 캐릭터를 감싸는 그룹 ref */}
      <group ref={container}>
        {/* 실제 카메라가 보는 부분 ref */}
        <group ref={cameraTarget} position-z={1.5} />
        {/* 카메라가 위치할 부분 ref */}
        <group ref={cameraPosition} position-y={7} position-z={-15} />
        <group ref={character}>
          <AnimatedRabbit animation={animation} />
        </group>
      </group>
      {/* args: [halfHeight, radius], rabbit 사이즈만큼 position으로 끌어올려야함 */}
      <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.3, 0]} />
    </RigidBody>
  );
};

export default RabbitController;
