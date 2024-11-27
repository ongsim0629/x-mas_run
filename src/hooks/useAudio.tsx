import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
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

  const lastPlayedBGM = useRef<'bgm' | 'gameover' | 'lobby'>('lobby');

  useEffect(() => {
    if (!audioEnabled) {
      playBGMAudio(lastPlayedBGM.current);
      return;
    }

    let targetBGM: 'bgm' | 'gameover' | 'lobby' = 'lobby';

    if (gameScreen === GameScreen.GAME) {
      targetBGM = 'bgm';
    } else if (gameScreen === GameScreen.GAME_OVER) {
      targetBGM = 'gameover';
    } else {
      targetBGM = 'lobby';
    }

    playBGMAudio(targetBGM);
    lastPlayedBGM.current = targetBGM;
  }, [audioEnabled, gameScreen, playBGMAudio]);

  return {
    audioEnabled,
    setAudioEnabled,
  };
};

export default useAudio;
