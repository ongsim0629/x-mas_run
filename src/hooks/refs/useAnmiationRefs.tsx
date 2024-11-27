import { useRef } from 'react';

const useAnimationRefs = () => {
  const punchAnimationTimer = useRef<NodeJS.Timeout | null>(null);
  const isPunching = useRef(false);
  const stolenAnimationTimer = useRef<NodeJS.Timeout | null>(null);
  const isCurrentlyStolen = useRef(false);

  return {
    punchAnimationTimer,
    isPunching,
    stolenAnimationTimer,
    isCurrentlyStolen,
  };
};
export default useAnimationRefs;
