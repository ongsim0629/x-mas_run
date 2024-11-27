import { Vector3, Camera } from 'three';
import { MathUtils } from 'three/src/math/MathUtils.js';
import { Group } from 'three';
import { MutableRefObject } from 'react';

type CameraConfig = {
  cameraTarget: MutableRefObject<Group | null>;
  cameraPosition: MutableRefObject<Group | null>;
  rotationTargetY: MutableRefObject<number>;
  currentExtraHeight: MutableRefObject<number>;
  currentExtraDistance: MutableRefObject<number>;
  currentCameraHeight: MutableRefObject<number>;
  currentForwardDistance: MutableRefObject<number>;
  cameraWorldPosition: MutableRefObject<Vector3>;
  cameraLookAtWorldPosition: MutableRefObject<Vector3>;
  cameraLookAt: MutableRefObject<Vector3>;
};

const useCamera = (config: CameraConfig) => {
  const updateCamera = (camera: Camera, isOnGround: boolean) => {
    if (!config.cameraPosition.current || !config.cameraTarget.current) return;

    const verticalOffset = Math.sin(config.rotationTargetY.current) * 15;
    const horizontalDistance = Math.cos(config.rotationTargetY.current) * 15;

    // 목표값 계산
    const targetExtraHeight =
      !isOnGround && config.rotationTargetY.current < -0.2 ? 0 : 0;
    const targetExtraDistance =
      !isOnGround && config.rotationTargetY.current < -0.2 ? 10 : 0;
    const targetCameraHeight =
      !isOnGround && config.rotationTargetY.current < -0.2 ? 15 : 0;
    const targetForwardDistance =
      !isOnGround && config.rotationTargetY.current < -0.2 ? 10 : 6;

    // 보간
    config.currentExtraHeight.current = MathUtils.lerp(
      config.currentExtraHeight.current,
      targetExtraHeight,
      0.05,
    );
    config.currentExtraDistance.current = MathUtils.lerp(
      config.currentExtraDistance.current,
      targetExtraDistance,
      0.05,
    );
    config.currentCameraHeight.current = MathUtils.lerp(
      config.currentCameraHeight.current,
      targetCameraHeight,
      0.05,
    );
    config.currentForwardDistance.current = MathUtils.lerp(
      config.currentForwardDistance.current,
      targetForwardDistance,
      0.05,
    );

    // 카메라 위치 설정
    config.cameraPosition.current.position.set(
      0,
      10 + verticalOffset + config.currentExtraHeight.current,
      -(horizontalDistance + config.currentExtraDistance.current),
    );

    config.cameraTarget.current.position.set(
      0,
      config.currentCameraHeight.current,
      config.currentForwardDistance.current,
    );

    // 카메라 업데이트
    config.cameraPosition.current.getWorldPosition(
      config.cameraWorldPosition.current,
    );
    camera.position.lerp(config.cameraWorldPosition.current, 0.1);

    config.cameraTarget.current.getWorldPosition(
      config.cameraLookAtWorldPosition.current,
    );
    config.cameraLookAt.current.lerp(
      config.cameraLookAtWorldPosition.current,
      0.1,
    );
    camera.lookAt(config.cameraLookAt.current);
  };

  return { updateCamera };
};

export default useCamera;
