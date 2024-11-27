import { useRef } from 'react';

const useMouseRefs = () => {
  const mouseControlRef = useRef<any>(null);
  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const rotationTargetY = useRef(0);

  return {
    mouseControlRef,
    characterRotationTarget,
    rotationTarget,
    rotationTargetY,
  };
};

export default useMouseRefs;
