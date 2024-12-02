import { atom } from 'jotai';
import {
  AudioInstance,
  BGMAudioType,
  GameItem,
  GameScreen,
} from '../types/game';
import { SocketService } from '../apis/SocketService';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { KillComboLogsInfo, KillLogInfo } from '../types/player';

export const gameScreenAtom = atomWithStorage<GameScreen>(
  'gameScreen',
  GameScreen.HOME,
  createJSONStorage(() => sessionStorage),
);

export const roomIdAtom = atomWithStorage<string>(
  'roomId',
  '',
  createJSONStorage(() => sessionStorage),
);

// Socket
export const socketServiceAtom = atom<SocketService | null>(null);
export const socketStatusAtom = atom<
  'connected' | 'disconnected' | 'connecting'
>('disconnected');

export const gameTimeAtom = atom<number | null>(null);

// Audio
const createAudio = (file: string, loop: boolean = false): AudioInstance => ({
  audio: new Audio(`${import.meta.env.VITE_MUSIC_URL}/${file}.mp3`),
  loop,
});
export const audioEnabledAtom = atom(false);
export const lastAudioPlayedAtom = atom(new Date().getTime());

export const audioInstanceAtom = atom<Record<BGMAudioType, AudioInstance>>({
  bgm: createAudio(import.meta.env.VITE_INGAME_MUSIC_NAME, true),
  lobby: createAudio(import.meta.env.VITE_LOBBY_MUSIC_NAME, true),
  gameover: createAudio(import.meta.env.VITE_GAMEOVER_MUSIC_NAME, true),
});

export const playBGMAudioAtom = atom(
  null,
  async (get, _, type: BGMAudioType) => {
    const instances = get(audioInstanceAtom);

    await Promise.all(
      Object.values(instances).map(async ({ audio }) => {
        try {
          await audio.pause();
          audio.currentTime = 0;
        } catch (error) {
          console.warn('BGM 정지 실패', error);
        }
      }),
    );

    if (!get(audioEnabledAtom)) return;

    const selectedAudio = instances[type];
    if (selectedAudio) {
      try {
        selectedAudio.audio.volume = 0.5;
        selectedAudio.audio.loop = selectedAudio.loop;
        await selectedAudio.audio.play();
      } catch (error) {
        console.warn('BGM :', error);
      }
    }
  },
);

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

export const killLogsAtom = atom<KillLogInfo[]>([]);
export const KillComboLogsAtom = atom<KillComboLogsInfo[]>([]);

export const gameItemsAtom = atom<GameItem[]>([]);
