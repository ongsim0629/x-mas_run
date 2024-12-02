import { useKeyboardControls } from '@react-three/drei';
import { useEffect, useState } from 'react';

type Controls =
  | 'forward'
  | 'backward'
  | 'left'
  | 'right'
  | 'jump'
  | 'catch'
  | 'skill'
  | 'item';

const useKeyControl = () => {
  const [, get] = useKeyboardControls<Controls>();
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const getState = () => {
    const keyboardState = get();
    return {
      ...keyboardState,
      catch: keyboardState.catch || isMouseDown,
    };
  };

  return getState;
};

export default useKeyControl;
