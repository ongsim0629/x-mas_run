import { useEffect, useRef, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Vector3, Quaternion, Mesh, Group } from 'three';
import { MapProps, TrainSystem, TrainMeshes } from '../../types/map';

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.location.reload();
  });
}

const TRAIN_NAMES = [
  'Train_A_color_0',
  'train_B_color_0',
  'train_C_color_0',
] as const;

const Map = ({ model, ...props }: MapProps) => {
  const { scene, animations } = useGLTF(model);
  const group = useRef<Group>(null);
  const { actions, mixer } = useAnimations(animations, group);
  const staticSceneRef = useRef<Group | null>(null);
  const trainSystemsRef = useRef<Record<string, TrainSystem>>({});

  // 맵의 애니메이션이 없는 부분과 기차 초기화
  const [staticScene, trainMeshes] = useMemo(() => {
    const clonedScene = scene.clone(true);
    const meshes: TrainMeshes = {
      trainA: clonedScene.getObjectByName('Train_A_color_0'),
      trainB: clonedScene.getObjectByName('train_B_color_0'),
      trainC: clonedScene.getObjectByName('train_C_color_0'),
    };

    TRAIN_NAMES.forEach((name) => {
      const obj = clonedScene.getObjectByName(name);
      if (obj) obj.removeFromParent();
    });

    return [clonedScene, meshes];
  }, [scene]);

  const cleanupScene = () => {
    if (staticSceneRef.current) {
      staticSceneRef.current.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((mat) => mat.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        }
      });
      staticSceneRef.current.removeFromParent();
      staticSceneRef.current = null;
    }

    Object.values(trainSystemsRef.current).forEach((system) => {
      if (system.trainMesh) {
        system.trainMesh.traverse((child) => {
          if ((child as Mesh).isMesh) {
            const mesh = child as Mesh;
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((mat) => mat.dispose());
              } else {
                mesh.material.dispose();
              }
            }
          }
        });
        system.trainMesh.removeFromParent();
      }
      if (system.rigidBody) system.rigidBody.setEnabled(false);
    });
  };

  useEffect(() => {
    cleanupScene();

    TRAIN_NAMES.forEach((name) => {
      const trainMesh = scene.getObjectByName(name);
      if (trainMesh) trainMesh.visible = false;
    });

    const systems: Record<string, TrainSystem> = {
      trainA: {
        trainMesh: trainMeshes.trainA?.clone() || null,
        controller: scene.getObjectByName('Train_A_CTRL') || null,
        rigidBody: null,
      },
      trainB: {
        trainMesh: trainMeshes.trainB?.clone() || null,
        controller: scene.getObjectByName('Train_B_CTRL') || null,
        rigidBody: null,
      },
      trainC: {
        trainMesh: trainMeshes.trainC?.clone() || null,
        controller: scene.getObjectByName('Train_C_CTRL') || null,
        rigidBody: null,
      },
    };

    trainSystemsRef.current = systems;
    
    // 애니메이션 설정
    if (actions && animations.length > 0) {
      mixer.stopAllAction();
      animations.forEach((animation) => {
        const action = actions[animation.name];
        if (action) {
          action.reset().play();
          action.timeScale = 0.2;
        }
      });
    }

    return () => {
      mixer?.stopAllAction();
      cleanupScene();
    };
  }, [scene, animations, actions, mixer, trainMeshes]);

  // 프레임마다 기차 위치 업데이트
  useFrame((_, delta) => {
    if (mixer) mixer.update(delta);

    Object.values(trainSystemsRef.current).forEach((system) => {
      if (!system.controller || !system.rigidBody) return;

      const worldPosition = new Vector3();
      const worldQuaternion = new Quaternion();

      system.controller.getWorldPosition(worldPosition);
      system.controller.getWorldQuaternion(worldQuaternion);

      system.rigidBody.setNextKinematicTranslation(worldPosition);
      system.rigidBody.setNextKinematicRotation(worldQuaternion);
    });
  });

  return (
    <group {...props} ref={group}>
      <primitive object={scene} />
      <RigidBody type="fixed" colliders="trimesh">
        <primitive object={staticScene} ref={staticSceneRef} />
      </RigidBody>
      {Object.entries(trainSystemsRef.current).map(
        ([key, system]) =>
          system.trainMesh && (
            <RigidBody
              key={`${key}-${system.trainMesh.uuid}`}
              type="kinematicPosition"
              colliders="trimesh"
              ref={(api) => {
                if (api) system.rigidBody = api;
              }}
            >
              <primitive object={system.trainMesh} />
            </RigidBody>
          ),
      )}
    </group>
  );
};

export default Map;

useGLTF.preload('/maps/map.glb');
