import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { forwardRef } from 'react';

type GLTFResult = GLTF & {
  nodes: {
    ['SantaHat_Cube002-Mesh']: THREE.Mesh;
    ['SantaHat_Cube002-Mesh_1']: THREE.Mesh;
  };
  materials: {
    Red: THREE.MeshStandardMaterial;
    White: THREE.MeshStandardMaterial;
  };
};

export const SantaHat = forwardRef<THREE.Group, JSX.IntrinsicElements['group']>(
  (props, ref) => {
    const { nodes, materials } = useGLTF('/models/SantaHat.glb') as GLTFResult;
    return (
      <group ref={ref} {...props} dispose={null}>
        <mesh
          geometry={nodes['SantaHat_Cube002-Mesh'].geometry}
          material={materials.Red}
        />
        <mesh
          geometry={nodes['SantaHat_Cube002-Mesh_1'].geometry}
          material={materials.White}
        />
      </group>
    );
  },
);

useGLTF.preload('/models/SantaHat.glb');
