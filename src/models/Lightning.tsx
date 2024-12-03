import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { playAudioAtom } from '../atoms/GameAtoms';
import { useAtom } from 'jotai';

type GLTFResult = GLTF & {
  nodes: {
    ['Node-Mesh']: THREE.Mesh;
    ['Node-Mesh_1']: THREE.Mesh;
    ['Node-Mesh_2']: THREE.Mesh;
  };
  materials: {
    mat21: THREE.MeshStandardMaterial;
    mat12: THREE.MeshStandardMaterial;
    mat4: THREE.MeshStandardMaterial;
  };
};

type LightningProps = {
  thunderEffect: number[];
} & Omit<JSX.IntrinsicElements['group'], 'position'>;

export function Lightning({ thunderEffect, ...props }: LightningProps) {
  const { nodes, materials } = useGLTF('/models/Lightning.glb') as GLTFResult;
  const lightningRef = useRef<THREE.Mesh>(null);
  const lightningOpacity = useRef(1);
  const lightningFlashSpeed = 0.1;
  const [, playAudio] = useAtom(playAudioAtom);
  const isThunderActive = thunderEffect[0] === 3; // 해당 인덱스의 값이 0인지 확인

  useFrame((state) => {
    // 번개 깜빡임 애니메이션 (번개가 활성화된 경우에만)
    if (lightningRef.current && isThunderActive) {
      playAudio('lightning');
      lightningOpacity.current +=
        Math.sin(state.clock.elapsedTime * 5) * lightningFlashSpeed;
      lightningOpacity.current = THREE.MathUtils.clamp(
        lightningOpacity.current,
        0.3,
        1,
      );

      if (lightningRef.current.material instanceof THREE.Material) {
        lightningRef.current.material.opacity = lightningOpacity.current;
      }
    }
  });

  const raindropCount = 100;
  const rainGeometry = new THREE.BufferGeometry();
  const rainPositions = new Float32Array(raindropCount * 3);

  for (let i = 0; i < raindropCount; i++) {
    rainPositions[i * 3] = Math.random() - 0.5;
    rainPositions[i * 3 + 1] = Math.random() * -0.6;
    rainPositions[i * 3 + 2] = Math.random() - 0.5;
  }

  rainGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(rainPositions, 3),
  );
  const rainRef = useRef<THREE.Points>(null);

  return (
    <group {...props} dispose={null} scale={4} position={[0, 5, 0]}>
      {/* 구름 */}
      <mesh geometry={nodes['Node-Mesh'].geometry} material={materials.mat21}>
        <meshStandardMaterial
          color="gray"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 번개부분 - thunderEffect[index]가 0일 때만 표시 */}
      {isThunderActive && (
        <mesh
          ref={lightningRef}
          geometry={nodes['Node-Mesh_1'].geometry}
          material={materials.mat12}
          scale={0.7}
        >
          <meshStandardMaterial color="gold" transparent opacity={1} />
        </mesh>
      )}

      {/* 비 파티클 */}
      <points ref={rainRef} geometry={rainGeometry}>
        <pointsMaterial
          color="skyblue"
          size={0.2}
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

useGLTF.preload('/models/Lightning.glb');
