import { useAtom } from 'jotai';
import { useEffect } from 'react';
import {
  audioEnabledAtom,
  bgAudioAtom,
  playAudioAtom,
} from '../atoms/GameAtoms';

const useAudio = () => {
  const [audioEnabled, setAudioEnabled] = useAtom(audioEnabledAtom);
  const [, playAudio] = useAtom(playAudioAtom);
  const [bgAudio] = useAtom(bgAudioAtom);

  useEffect(() => {
    if (audioEnabled) {
      bgAudio.play();
      bgAudio.loop = true;
    } else {
      bgAudio.pause();
    }
  }, [audioEnabled, bgAudio]);

  return {
    audioEnabled,
    setAudioEnabled,
    playAudio,
  };
};

export default useAudio;
