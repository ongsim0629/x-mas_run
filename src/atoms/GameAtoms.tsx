import { atom } from 'jotai';
import { AudioInstance, BGMAudioType, GameScreen } from '../types/game';
import { SocketService } from '../apis/SocketService';

export const gameScreenAtom = atom<GameScreen>(GameScreen.LOADING);
export const nicknameAtom = atom<string>('');

// Socket
export const socketServiceAtom = atom<SocketService | null>(null);
export const socketStatusAtom = atom<
  'connected' | 'disconnected' | 'connecting'
>('disconnected');

export const gameTimeAtom = atom<number | null>(null);

// Audio
const createAudio = (file: string, loop: boolean = false): AudioInstance => ({
  audio: new Audio(`/audio/${file}.mp3`),
  loop,
});

export const audioEnabledAtom = atom(false);
export const lastAudioPlayedAtom = atom(new Date().getTime());

export const audioInstanceAtom = atom<Record<BGMAudioType, AudioInstance>>({
  bgm: createAudio('bgm', true),
  lobby: createAudio('lobby', true),
  gameover: createAudio('gameover', true),
});

export const playBGMAudioAtom = atom(null, (get, _, type: BGMAudioType) => {
  const instances = get(audioInstanceAtom);
  Object.values(instances).forEach(({ audio }) => {
    audio.pause();
    audio.currentTime = 0;
  });
  if (!get(audioEnabledAtom)) return;

  const selectedAudio = instances[type];
  if (selectedAudio) {
    selectedAudio.audio.loop = selectedAudio.loop;
    selectedAudio.audio.play();
  }
});

export const playAudioAtom = atom(
  null,
  (get, set, file: string, force = false) => {
    if (!get(audioEnabledAtom)) {
      return;
    }

    // 연속으로 재생되는거 막음
    const lastPlayed = get(lastAudioPlayedAtom);
    if (!force && new Date().getTime() - lastPlayed < 100) {
      return;
    }

    set(lastAudioPlayedAtom, new Date().getTime());
    const audio = new Audio(`/audio/${file}.mp3`);
    audio.play();
  },
);
