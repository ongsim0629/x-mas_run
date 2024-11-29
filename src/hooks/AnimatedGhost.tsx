import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
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
  isTransparent?: boolean;
} & JSX.IntrinsicElements['group'];

export function AnimatedGhost({
  animation,
  charColor,
  nickName,
  isTransparent = false,
  ...props
}: AnimatedGhostProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/AnimatedGhost.glb');
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone) as GLTFResult;
  const { actions } = useAnimations(animations, group);
  const nicknameRef = useRef<THREE.Group>(null);
  const [opacity, setOpacity] = useState(1);
  const time = useRef(0);

  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.5).play();
    return () => {
      actions[animation]?.fadeOut(0.5);
    };
  }, [animation]);

  useFrame(({ camera, clock }) => {
    if (nicknameRef.current) {
      nicknameRef.current.lookAt(camera.position);
    }
    time.current += clock.getDelta();
    const targetOpacity = isTransparent ? 0.3 : 1;
    const lerpSpeed = 0.1;
    setOpacity(THREE.MathUtils.lerp(opacity, targetOpacity, lerpSpeed));
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
            material-opacity={opacity}
            material-transparent
          >
            {nickName}
            <meshBasicMaterial color="white" transparent />
          </Text>
          <Text
            position-y={3.98}
            position-x={0.02}
            position-z={-0.02}
            fontSize={0.4}
            anchorX="center"
            anchorY="middle"
            font="fonts/PaytoneOne-Regular.ttf"
            material-opacity={opacity}
            material-transparent
          >
            {nickName}
            <meshBasicMaterial color="black" transparent />
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
              skeleton={nodes.Ghost_1.skeleton}
            >
              <meshStandardMaterial
                color="white"
                transparent
                opacity={opacity}
              />
            </skinnedMesh>
            <skinnedMesh
              name="Ghost_2"
              geometry={nodes.Ghost_2.geometry}
              skeleton={nodes.Ghost_2.skeleton}
            >
              <meshStandardMaterial
                color="black"
                transparent
                opacity={opacity}
              />
            </skinnedMesh>
            <skinnedMesh
              name="Ghost_3"
              geometry={nodes.Ghost_3.geometry}
              skeleton={nodes.Ghost_3.skeleton}
            >
              <meshStandardMaterial
                color={charColor}
                transparent
                opacity={opacity}
              />
            </skinnedMesh>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/models/AnimatedGhost.glb');
