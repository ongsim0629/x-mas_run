import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import {
  audioEnabledAtom,
  gameScreenAtom,
  playBGMAudioAtom,
} from '../atoms/GameAtoms';
import { GameScreen } from '../types/game';

const useAudio = () => {
  const [audioEnabled, setAudioEnabled] = useAtom(audioEnabledAtom);
  const [, playBGMAudio] = useAtom(playBGMAudioAtom);
  const gameScreen = useAtomValue(gameScreenAtom);

  useEffect(() => {
    if (!audioEnabled) {
      playBGMAudio('bgm');
      return;
    }
    if (gameScreen === GameScreen.GAME) playBGMAudio('bgm');
    else if (gameScreen === GameScreen.GAME_OVER) playBGMAudio('gameover');
    else playBGMAudio('lobby');
  }, [audioEnabled, gameScreen, playBGMAudio]);

  return {
    audioEnabled,
    setAudioEnabled,
  };
};

export default useAudio;
