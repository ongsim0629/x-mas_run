import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { Position } from '../types/player';

type GLTFResult = GLTF & {
  nodes: {
    Cube002_Material002_0: THREE.Mesh;
    Cube001_Material003_0: THREE.Mesh;
    Cube003_Material002_0: THREE.Mesh;
    Cube005_Material002_0: THREE.Mesh;
    Cube006_Material002_0: THREE.Mesh;
  };
  materials: {
    ['Material.002']: THREE.MeshStandardMaterial;
    ['Material.003']: THREE.MeshStandardMaterial;
  };
};
type Props = {
  position: Position;
  color: string;
} & Omit<JSX.IntrinsicElements['group'], 'position'>;

export function ItemBox({ position, color, ...props }: Props) {
  const { nodes, materials } = useGLTF('/models/ItemBox.glb') as GLTFResult;
  const positionArray: [number, number, number] = [
    position.x,
    position.y,
    position.z,
  ];
  return (
    <group {...props} dispose={null} position={positionArray} scale={2}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.082}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <mesh
            geometry={nodes.Cube002_Material002_0.geometry}
            material={materials['Material.002']}
            rotation={[-Math.PI / 2, 0, 0.556]}
            scale={412.961}
          >
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh
            geometry={nodes.Cube001_Material003_0.geometry}
            material={materials['Material.003']}
            rotation={[-Math.PI / 2, 0, 0.556]}
            scale={412.961}
          >
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh
            geometry={nodes.Cube003_Material002_0.geometry}
            material={materials['Material.002']}
            rotation={[-Math.PI / 2, 0, 0.556]}
            scale={412.961}
          >
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh
            geometry={nodes.Cube005_Material002_0.geometry}
            material={materials['Material.002']}
            rotation={[-Math.PI / 2, 0, 0.556]}
            scale={412.961}
          >
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh
            geometry={nodes.Cube006_Material002_0.geometry}
            material={materials['Material.002']}
            rotation={[-Math.PI / 2, 0, 0.556]}
            scale={412.961}
          >
            <meshStandardMaterial color="white" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/models/ItemBox.glb');
