import {
  BackSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  MeshBasicMaterial,
} from 'three';
import { useGLTF, LOD } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { Position } from '../types/player';
import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

type GLTFResult = GLTF & {
  nodes: {
    Cube002_Material002_0: Mesh;
    Cube001_Material003_0: Mesh;
    Cube003_Material002_0: Mesh;
    Cube005_Material002_0: Mesh;
    Cube006_Material002_0: Mesh;
  };
  materials: {
    ['Material.002']: MeshStandardMaterial;
    ['Material.003']: MeshStandardMaterial;
  };
};

type Props = {
  position: Position;
  color: string;
  isDisappearing?: boolean;
  isSimplified?: boolean; // 단순화된 버전인지
  isVerySimplified?: boolean; // 매우 단순화된 버전인지
  lodLevel?: number; // LOD 레벨
} & Omit<JSX.IntrinsicElements['group'], 'position'>;

export function ItemBox({
  position,
  color,
  isDisappearing = false,isSimplified, isVerySimplified, lodLevel
  ...props
}: Props) {
  const { nodes } = useGLTF('/models/ItemBox.glb') as GLTFResult;
  const groupRef = useRef<Group>(null);
  const [scale] = useState(2);
  const [emissiveIntensity] = useState(0);
  const [opacity] = useState(1);

  const positionArray: [number, number, number] = [
    position.x,
    position.y,
    position.z,
  ];

  // 호버링 효과
  useFrame((state) => {
    if (groupRef.current && !isDisappearing) {
      groupRef.current.position.y =
        position.y + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.rotation.y += isVerySimplified
        ? 0.002
        : isSimplified
          ? 0.005
          : 0.01;
    }
  });

  // 매우 단순화된 버전
  if (isVerySimplified) {
    return (
      <mesh position={positionArray} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={color} opacity={0.8} transparent />
      </mesh>
    );
  }

  if (isSimplified) {
    return (
      <group ref={groupRef} position={positionArray} scale={scale}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={0.2}
            opacity={0.9} 
            transparent 
          />
        </mesh>
      </group>
    );
  }


  return (
    <group
      ref={groupRef}
      {...props}
      dispose={null}
      position={positionArray}
      scale={scale}
    >
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.082}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <mesh
            geometry={nodes.Cube002_Material002_0.geometry}
            rotation={[-Math.PI / 2, 0, 0.556]}
            scale={412.961}
          >
            <meshStandardMaterial
              color="white"
              transparent
              opacity={opacity}
              emissive="white"
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          <mesh
            geometry={nodes.Cube001_Material003_0.geometry}
            rotation={[-Math.PI / 2, 0, 0.556]}
            scale={412.961}
          >
            <meshStandardMaterial
              color={color}
              transparent
              opacity={opacity}
              emissive={color}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          <mesh
            geometry={nodes.Cube003_Material002_0.geometry}
            rotation={[-Math.PI / 2, 0, 0.556]}
            scale={412.961}
          >
            <meshStandardMaterial
              color="white"
              transparent
              opacity={opacity}
              emissive="white"
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          <mesh
            geometry={nodes.Cube005_Material002_0.geometry}
            rotation={[-Math.PI / 2, 0, 0.556]}
            scale={412.961}
          >
            <meshStandardMaterial
              color="white"
              transparent
              opacity={opacity}
              emissive="white"
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          <mesh
            geometry={nodes.Cube006_Material002_0.geometry}
            rotation={[-Math.PI / 2, 0, 0.556]}
            scale={412.961}
          >
            <meshStandardMaterial
              color="white"
              transparent
              opacity={opacity}
              emissive="white"
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        </group>
      </group>

      {!isDisappearing && (
        <mesh scale={1}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1}
            side={BackSide}
          />
        </mesh>
      )}
    </group>
  );
}

useGLTF.preload('/models/ItemBox.glb');
