import { CapsuleCollider, RigidBody } from '@react-three/rapier';
import React, { useRef, useState } from 'react';
import { AnimatedRabbit, RabbitActionName } from '../models/AnimatedRabbit';
import { useControls } from 'leva';
import { degToRad } from 'three/src/math/MathUtils.js';

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
  const rb = useRef();
  const [animation, setAnimation] = useState<RabbitActionName>(
    'CharacterArmature|Idle'
  );
  return (
    // 충돌 감지 비활성화: Capsule 쓰기 위해서, lockRotations: 안넘어지게
    <RigidBody colliders={false} lockRotations ref={rb}>
      <AnimatedRabbit animation={animation} />
      {/* args: [halfHeight, radius], rabbit 사이즈만큼 position으로 끌어올려야함 */}
      <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.3, 0]} />
    </RigidBody>
  );
};

export default RabbitController;
