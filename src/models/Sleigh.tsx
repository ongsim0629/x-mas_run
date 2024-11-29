import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    sleigh_gold_0: THREE.Mesh;
    sleigh_black_0: THREE.Mesh;
    sleigh_Snow001_0: THREE.Mesh;
    sleigh_red_0: THREE.Mesh;
  };
  materials: {
    gold: THREE.MeshStandardMaterial;
    black: THREE.MeshStandardMaterial;
    ['Snow.001']: THREE.MeshStandardMaterial;
    material: THREE.MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/models/Sleigh.glb') as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <group
          position={[-109.301, 194.531, 0]}
          rotation={[-Math.PI / 2, 0.175, 0]}
          scale={100}
        >
          <mesh
            geometry={nodes.sleigh_gold_0.geometry}
            material={materials.gold}
          />
          <mesh
            geometry={nodes.sleigh_black_0.geometry}
            material={materials.black}
          />
          <mesh
            geometry={nodes.sleigh_Snow001_0.geometry}
            material={materials['Snow.001']}
          />
          <mesh
            geometry={nodes.sleigh_red_0.geometry}
            material={materials.material}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/models/Sleigh.glb');
