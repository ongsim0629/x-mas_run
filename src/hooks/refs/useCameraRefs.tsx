import { useRef } from 'react';
import { Group, Vector3 } from 'three';

const useCameraRefs = () => {
  const cameraTarget = useRef<Group>(null);
  const cameraPosition = useRef<Group>(null);
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const currentExtraHeight = useRef(0);
  const currentExtraDistance = useRef(0);
  const currentCameraHeight = useRef(0);
  const currentForwardDistance = useRef(6);

  return {
    cameraTarget,
    cameraPosition,
    cameraLookAtWorldPosition,
    cameraWorldPosition,
    cameraLookAt,
    currentExtraHeight,
    currentExtraDistance,
    currentCameraHeight,
    currentForwardDistance,
  };
};
export default useCameraRefs;
