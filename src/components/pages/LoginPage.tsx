import { ChangeEvent, FormEvent, useCallback } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { playerInfoAtom } from '../../atoms/PlayerAtoms';
import { gameScreenAtom } from '../../atoms/GameAtoms';
import { GameScreen } from '../../types/game';
import useGame from '../../hooks/useGame';
import useAudio from '../../hooks/useAudio';
import { FaBell, FaBellSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [player, setPlayer] = useAtom(playerInfoAtom);
  const setGameScreen = useSetAtom(gameScreenAtom);
  const { registerPlayerQuery } = useGame();
  const { audioEnabled, setAudioEnabled } = useAudio();
  const handleAudioClick = () => {
    setAudioEnabled((prev) => !prev);
  };

  const handleRegisterPlayer = useCallback(
    async (e: FormEvent<HTMLElement>) => {
      e.preventDefault();
      const userId = await registerPlayerQuery(player);
      setGameScreen(GameScreen.HOME);
      setPlayer((prev) => ({ ...prev, id: userId }));
    },
    [player, registerPlayerQuery, setGameScreen],
  );

  const handleNicknameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPlayer((prev) => ({ ...prev, nickname: e.target.value }));
    },
    [player, setPlayer],
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center flex-col">
      <button
        className="flex justify-end absolute top-5 right-5 z-20 "
        onClick={handleAudioClick}
        type="button"
        aria-label="sound-button"
      >
        {audioEnabled ? (
          <FaBell className="w-10 h-10 cursor-pointer text-white my-2 hover:scale-110" />
        ) : (
          <FaBellSlash className="w-10 h-10 cursor-pointer text-white my-2 hover:scale-110" />
        )}
      </button>
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
        aria-label="xmas-background-video"
      >
        <source src={import.meta.env.VITE_VIDEO_URL} type="video/mp4" />
      </video>
      <div className="relative z-10 flex flex-col gap-10">
        <h1 className="text-center font-bold text-white text-6xl border-separate">
          X-MAS RUN🎅🏻
        </h1>
        <form
          onSubmit={handleRegisterPlayer}
          className="flex flex-col justify-center gap-6 bg-white p-8 rounded-lg shadow-xl min-w-[28rem]"
          aria-label="signIn-form"
        >
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold">닉네임</label>
            <input
              aria-label="nickname-input"
              type="text"
              onChange={handleNicknameChange}
              placeholder={player.nickname || '닉네임을 입력하세요'}
              className="w-full text-lg p-3 border border-gray-300 rounded focus:outline-none"
            />
            <small className="ml-1">게스트 모드로 바로 입장가능해요🧑‍🎄</small>
          </div>
          <button
            type="submit"
            className="w-full bg-0-accentColor text-white py-3 rounded hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            입장하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
