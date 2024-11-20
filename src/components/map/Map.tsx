import { useAnimations, useGLTF } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useEffect, useRef } from 'react';
import { Group, Mesh, Vector3 } from 'three';
interface MapProps extends Omit<GroupProps, 'args'> {
  model: string;
  position?: Vector3 | [number, number, number];
  scale?: Vector3 | [number, number, number] | number;
}
const Map = ({ model, ...props }: MapProps) => {
  const { scene, animations } = useGLTF(model);
  const group = useRef<Group>(null);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (actions && animations.length > 0) {
      const actionName = animations[0].name;
      actions[actionName]?.play();
    }
  }, [actions, animations]);

  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive object={scene} {...props} ref={group} />
      </RigidBody>
    </group>
  );
};

export default Map;
