import { CapsuleCollider, RigidBody } from '@react-three/rapier';
import React, { useRef, useState } from 'react';
import { AnimatedRabbit, RabbitActionName } from '../models/AnimatedRabbit';
import { useControls } from 'leva';
import { degToRad } from 'three/src/math/MathUtils.js';
import { Group, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

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
  const rb = useRef();
  const container = useRef<Group>();
  const cameraTarget = useRef<Group>();
  const cameraPosition = useRef<Group>(); // 그룹 내에서의 상대적 위치
  const cameraLookAtWorldPosition = useRef(new Vector3()); // cameraTarget의 절대 위치
  const cameraWorldPosition = useRef(new Vector3()); // cameraPosition의 절대 위치
  const cameraLookAt = useRef(new Vector3()); // 부드럽게 해당 위치로 회전하기 위한 Ref

  useFrame(({ camera }) => {
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
        <group ref={cameraPosition} position-y={4} position-z={-4} />
        <AnimatedRabbit animation={animation} />
      </group>
      {/* args: [halfHeight, radius], rabbit 사이즈만큼 position으로 끌어올려야함 */}
      <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.3, 0]} />
    </RigidBody>
  );
};

export default RabbitController;
