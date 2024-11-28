import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations, Text } from '@react-three/drei';
import { GLTF, SkeletonUtils } from 'three-stdlib';

export type GhostActionName =
  | 'CharacterArmature|Death'
  | 'CharacterArmature|Fast_Flying'
  | 'CharacterArmature|Flying_Idle'
  | 'CharacterArmature|Headbutt'
  | 'CharacterArmature|HitReact'
  | 'CharacterArmature|No'
  | 'CharacterArmature|Punch'
  | 'CharacterArmature|Yes';

interface GLTFAction extends THREE.AnimationClip {
  name: GhostActionName;
}

type GLTFResult = GLTF & {
  nodes: {
    Ghost_1: THREE.SkinnedMesh;
    Ghost_2: THREE.SkinnedMesh;
    Ghost_3: THREE.SkinnedMesh;
    Root: THREE.Bone;
  };
  materials: {
    Eye_White: THREE.MeshStandardMaterial;
    Eye_Black: THREE.MeshStandardMaterial;
    Ghost_Main: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

type AnimatedGhostProps = {
  animation: GhostActionName;
  charColor: string;
  nickName: string;
} & JSX.IntrinsicElements['group'];

export function AnimatedGhost({
  animation,
  charColor,
  nickName,
  ...props
}: AnimatedGhostProps) {
  const group = React.useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/AnimatedGhost.glb');
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as GLTFResult;
  const { actions } = useAnimations(animations, group);
  const nicknameRef = useRef<THREE.Group>(null);

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
            position-y={4}
            fontSize={0.4}
            anchorX="center"
            anchorY="middle"
            font="fonts/PaytoneOne-Regular.ttf"
          >
            {nickName}
            <meshBasicMaterial color="white" />
          </Text>
          <Text
            position-y={3.98}
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
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="CharacterArmature"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <primitive object={nodes.Root} />
          </group>
          <group name="Ghost" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Ghost_1"
              geometry={nodes.Ghost_1.geometry}
              material={materials.Eye_White}
              skeleton={nodes.Ghost_1.skeleton}
            >
              <meshStandardMaterial color="white" />
            </skinnedMesh>
            <skinnedMesh
              name="Ghost_2"
              geometry={nodes.Ghost_2.geometry}
              material={materials.Eye_Black}
              skeleton={nodes.Ghost_2.skeleton}
            />
            <skinnedMesh
              name="Ghost_3"
              geometry={nodes.Ghost_3.geometry}
              material={materials.Ghost_Main}
              skeleton={nodes.Ghost_3.skeleton}
            >
              <meshStandardMaterial color={charColor} />
            </skinnedMesh>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/models/AnimatedGhost.glb');
