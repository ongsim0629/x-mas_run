import { Mesh, MeshStandardMaterial, Object3D } from 'three';
import { GLTF } from 'three-stdlib';
import { useGLTF } from '@react-three/drei';

type ModelProps = JSX.IntrinsicElements['group'];

export function Model(props: ModelProps) {
  const { scene } = useGLTF('/models/Sleigh.glb') as GLTF;

  const materials: Record<string, MeshStandardMaterial> = {
    sleigh_red_0: new MeshStandardMaterial({ color: 'red' }),
    sleigh_gold_0: new MeshStandardMaterial({ color: 'gold' }),
    sleigh_black_0: new MeshStandardMaterial({ color: 'black' }),
    sleigh_Snow001_0: new MeshStandardMaterial({ color: 'white' }),
  };

  scene.traverse((child: Object3D) => {
    if (child instanceof Mesh) {
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
