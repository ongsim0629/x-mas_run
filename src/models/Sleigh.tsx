import { Euler, Group, Mesh, MeshStandardMaterial, Object3D } from 'three';
import { useRef, useEffect } from 'react';
import { GLTF } from 'three-stdlib';
import { useGLTF } from '@react-three/drei';

type ModelProps = JSX.IntrinsicElements['group'] & {
  rotation?: Euler;
  velocity?: Euler;
};

export function Model({ rotation, ...props }: ModelProps) {
  const { scene } = useGLTF('/models/Sleigh.glb') as GLTF;
  const sleighRef = useRef<Group>(null);

  const materials: Record<string, MeshStandardMaterial> = {
    sleigh_red_0: new MeshStandardMaterial({ color: 'red' }),
    sleigh_gold_0: new MeshStandardMaterial({ color: 'gold' }),
    sleigh_black_0: new MeshStandardMaterial({ color: 'black' }),
    sleigh_Snow001_0: new MeshStandardMaterial({ color: 'white' }),
  };

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child: Object3D) => {
      if (child instanceof Mesh) {
        const material = materials[child.name];
        if (material) {
          child.material = material;
        }
      }
    });

    scene.rotation.set(0, Math.PI / 2, 0);

    return () => {
      Object.values(materials).forEach((material) => material.dispose());
    };
  }, [scene]);

  useEffect(() => {
    if (!sleighRef.current || !rotation) return;

    try {
      sleighRef.current.rotation.copy(rotation);
      sleighRef.current.rotation.y += Math.PI;
    } catch (error) {
      console.error('Error updating sleigh rotation:', error);
    }
  }, [rotation]);

  return (
    <group ref={sleighRef} {...props}>
      <primitive object={scene} dispose={null} />
    </group>
  );
}

useGLTF.preload('/models/Sleigh.glb');
