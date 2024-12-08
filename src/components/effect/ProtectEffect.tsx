import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshBasicMaterial, Color } from 'three';

interface ProtectEffectProps {
  duration: number;
  radius: number;
  color?: string; // 동적으로 전달될 색상
}

const ProtectEffect = ({
  duration,
  radius,
  color = '#FFE31A',
}: ProtectEffectProps) => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshBasicMaterial>(null);
  const activeRef = useRef<boolean>(false);

  // protect 상태가 변경될 때마다 활성화 상태 업데이트
  useEffect(() => {
    activeRef.current = duration > 0;

    // 색상 업데이트
    if (materialRef.current) {
      materialRef.current.color = new Color(color);
    }
  }, [duration, color]);

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
        color={color}
      />
    </mesh>
  );
};

export default ProtectEffect;
