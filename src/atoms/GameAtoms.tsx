import { atom } from 'jotai';
import { GameScreen } from '../types/game';
import { SocketService } from '../apis/SocketService';

export const gameScreenAtom = atom<GameScreen>(GameScreen.LOADING);
export const nicknameAtom = atom<string>('');

// Socket
export const socketServiceAtom = atom<SocketService | null>(null);
export const socketStatusAtom = atom<
  'connected' | 'disconnected' | 'connecting'
>('disconnected');

export const gameTimeAtom = atom<number | null>(null);

export const audioEnabledAtom = atom(false);

export const lastAudioPlayedAtom = atom(new Date().getTime());

export const bgAudioAtom = atom(new Audio('/audio/bgm.mp3'));

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
