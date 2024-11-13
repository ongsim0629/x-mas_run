import { RigidBody } from '@react-three/rapier';
import React from 'react';

export const PLATFORM_WIDTH = 200;
export const PLATFORM_HEIGHT = 200;
// 다양한 색상을 쓰고 싶은 경우, Color 객체에 multiplyScalar로 진하기 랜덤 조정 가능
export const PLATFORM_COLOR = 'plum';

const GroundMap: React.FC = () => {
  return (
    <RigidBody type="fixed" colliders="hull">
      <mesh rotation-x={-Math.PI / 2} position-y={-0.001}>
        <planeGeometry args={[PLATFORM_WIDTH, PLATFORM_HEIGHT]} />
        <meshStandardMaterial color={PLATFORM_COLOR} />
      </mesh>
    </RigidBody>
  );
};

export default GroundMap;
