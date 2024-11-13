import { RigidBody } from '@react-three/rapier';
import React, { useRef, useState } from 'react';
import { AnimatedRabbit, RabbitActionName } from '../models/AnimatedRabbit';

const RabbitController = () => {
  const rb = useRef();
  const [animation, setAnimation] = useState<RabbitActionName>(
    'CharacterArmature|Idle'
  );
  return (
    // 충돌 감지 비활성화: Capsule 쓰기 위해서, lockRotations: 안넘어지게
    <RigidBody colliders={false} lockRotations ref={rb}>
      <AnimatedRabbit animation={animation} />
    </RigidBody>
  );
};

export default RabbitController;
