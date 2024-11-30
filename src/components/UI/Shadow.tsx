import { useFrame } from '@react-three/fiber';
import { RefObject, useMemo, useState } from 'react';
import { Group, Vector3 } from 'three';

type CircleShadowProps = {
  target: RefObject<Group>;
};
const CircleShadow = ({ target }: CircleShadowProps) => {
  const [shadowSize, setShadowSize] = useState(1);
  const [shadowPosition, setShadowPosition] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const vector = useMemo(() => new Vector3(), []);
  useFrame(() => {
    if (target.current) {
      const pos = target.current.getWorldPosition(vector);
      const size = Math.max(0.2, 0.8 - pos.y * 0.1);
      setShadowSize(size);
      setShadowPosition([pos.x, 0.01, pos.z]);
    }
  });

  return (
    <mesh position={shadowPosition} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[shadowSize, 32]} />
      <meshBasicMaterial
        color="black"
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </mesh>
  );
};
export default CircleShadow;