import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshBasicMaterial } from 'three';

interface ProtectEffectProps {
  duration: number;
  radius: number;
}

const ProtectEffect = ({ duration, radius }: ProtectEffectProps) => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshBasicMaterial>(null);
  const activeRef = useRef<boolean>(false);

  // protect 상태가 변경될 때마다 활성화 상태 업데이트
  useEffect(() => {
    activeRef.current = duration > 0;
  }, [duration]);

  useFrame(() => {
    if (!meshRef.current || !materialRef.current || !activeRef.current) return;

    const pulseSpeed = 2;
    const pulseAmount = 0.2;
    const scale = 1 + Math.sin(Date.now() * 0.003 * pulseSpeed) * pulseAmount;

    meshRef.current.scale.setScalar(scale * radius);

    if (materialRef.current) {
      const opacity = 0.3 + Math.sin(Date.now() * 0.003 * pulseSpeed) * 0.1;
      materialRef.current.opacity = opacity;
    }
  });

  if (duration <= 0) return null;

  return (
    <mesh ref={meshRef} position={[0, 1.8, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        ref={materialRef}
        transparent
        opacity={0.3}
        color="#FFE31A"
      />
    </mesh>
  );
};

export default ProtectEffect;
