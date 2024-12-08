import React, { useRef, useEffect, useMemo } from 'react';
import { DoubleSide, Group, Mesh, TextureLoader, Vector3 } from 'three';
import gsap from 'gsap';

type DizzyEffectProps = {
  position: Vector3 | [number, number, number];
};

const DizzyEffect: React.FC<DizzyEffectProps> = ({ position }) => {
  const orbitRef = useRef<Group>(null);
  const ringRef = useRef<Mesh>(null);

  const loader = useMemo(() => new TextureLoader(), []);
  const starTexture = useMemo(() => loader.load('/images/star.webp'), [loader]);
  const starCount = 3;
  const orbitRadius = 1;

  // 궤도 회전
  useEffect(() => {
    if (orbitRef.current) {
      gsap.to(orbitRef.current.rotation, {
        y: Math.PI * 2,
        repeat: -1,
        duration: 3,
        ease: 'linear',
      });
    }
  }, []);

  return (
    <group position={position}>
      <group ref={orbitRef}>
        {[...Array(starCount)].map((_, i) => {
          const angle = (i / starCount) * Math.PI * 2;

          return (
            <sprite
              key={i}
              position={[
                Math.cos(angle) * orbitRadius,
                0,
                Math.sin(angle) * orbitRadius,
              ]}
              scale={[0.5, 0.5, 0.5]}
            >
              <spriteMaterial
                map={starTexture}
                transparent
                depthWrite={false}
                opacity={1}
              />
            </sprite>
          );
        })}
      </group>

      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.05, orbitRadius + 0.05, 64]} />
        <meshBasicMaterial
          color="white"
          transparent
          opacity={0.8}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default React.memo(DizzyEffect);
