import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { useGLTF } from '@react-three/drei';

type ModelProps = JSX.IntrinsicElements['group'];

export function Model(props: ModelProps) {
  const { scene } = useGLTF('/models/Sleigh.glb') as GLTF;

  const materials: Record<string, THREE.MeshStandardMaterial> = {
    sleigh_red_0: new THREE.MeshStandardMaterial({ color: 'red' }),
    sleigh_gold_0: new THREE.MeshStandardMaterial({ color: 'gold' }),
    sleigh_black_0: new THREE.MeshStandardMaterial({ color: 'black' }),
    sleigh_Snow001_0: new THREE.MeshStandardMaterial({ color: 'white' }),
  };

  scene.traverse((child: THREE.Object3D) => {
    if (child instanceof THREE.Mesh) {
      const material = materials[child.name];
      if (material) {
        child.material = material;
      }
    }
  });

  return (
    <group {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/Sleigh.glb');
