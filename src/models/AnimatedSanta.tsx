import {
  AnimationClip,
  Bone,
  Group,
  MeshStandardMaterial,
  SkinnedMesh,
} from 'three';
import React, { useEffect, useRef } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations, Text } from '@react-three/drei';
import { GLTF, SkeletonUtils } from 'three-stdlib';

export type SantaActionName =
  | 'Armature|Armature.001|mixamo.com|Layer0'
  | 'Armature|Excited'
  | 'Armature|happy Idle'
  | 'Armature|Jump'
  | 'Armature|Run'
  | 'Armature|Run.001';

interface GLTFAction extends AnimationClip {
  name: SantaActionName;
}

type GLTFResult = GLTF & {
  nodes: {
    Object_56: SkinnedMesh;
    _rootJoint: Bone;
  };
  materials: {
    Santa2: MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

type AnimatedSantaProps = {
  animation: SantaActionName;
  charColor: string;
  nickName: string;
} & JSX.IntrinsicElements['group'];

export function AnimatedSanta({
  animation,
  charColor = 'red',
  nickName = 'TUTTIN',
  ...props
}: AnimatedSantaProps) {
  const group = React.useRef<Group>(null);
  const { scene, animations } = useGLTF('/models/AnimatedSanta.glb');
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as GLTFResult;
  const { actions } = useAnimations(animations, group);
  const nicknameRef = useRef<Group>(null);

  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.5).play();
    return () => {
      actions[animation]?.fadeOut(0.5);
    };
  }, [animation]);

  useFrame(({ camera }) => {
    if (nicknameRef.current) {
      nicknameRef.current.lookAt(camera.position);
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {nickName && (
        <group ref={nicknameRef}>
          <Text
            position-y={5}
            fontSize={0.4}
            anchorX="center"
            anchorY="middle"
            font="fonts/PaytoneOne-Regular.ttf"
          >
            {nickName}
            <meshBasicMaterial color="white" />
          </Text>
          <Text
            position-y={4.98}
            position-x={0.02}
            position-z={-0.02}
            fontSize={0.4}
            anchorX="center"
            anchorY="middle"
            font="fonts/PaytoneOne-Regular.ttf"
          >
            {nickName}
            <meshBasicMaterial color="black" />
          </Text>
        </group>
      )}
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group
            name="49febb4e955e48fdbd5bc1e3826d88d0fbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.8}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group name="Armature">
                  <group name="Object_5">
                    <primitive object={nodes._rootJoint} />
                    <group name="Object_55" />
                    <skinnedMesh
                      name="Object_56"
                      geometry={nodes.Object_56.geometry}
                      material={materials.Santa2}
                      skeleton={nodes.Object_56.skeleton}
                    ></skinnedMesh>
                  </group>
                </group>
                <group name="Santa" />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/models/AnimatedSanta.glb');
