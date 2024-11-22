import { ChangeEvent, useCallback, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { playerInfoAtom } from '../../atoms/PlayerAtoms';
import { gameScreenAtom } from '../../atoms/GameAtoms';
import { GameScreen } from '../../types/game';
import useGame from '../../hooks/useGame';
import useAudio from '../../hooks/useAudio';

const LoginPage = () => {
  const [player, setPlayer] = useAtom(playerInfoAtom);
  const setGameScreen = useSetAtom(gameScreenAtom);
  const { registerPlayerQuery } = useGame();
  const { setAudioEnabled } = useAudio();
  const handleAudioClick = () => {
    setAudioEnabled((prev) => !prev);
  };

  const handleRegisterPlayer = useCallback(async () => {
    const userId = await registerPlayerQuery(player);
    setGameScreen(GameScreen.HOME);
    setPlayer((prev) => ({ ...prev, id: userId }));
  }, [player, registerPlayerQuery, setGameScreen]);

  const handleNicknameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPlayer((prev) => ({ ...prev, nickname: e.target.value }));
    },
    [player, setPlayer],
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-600 to-blue-600 flex items-center justify-center">
      <button onClick={handleAudioClick}>소리 켜기</button>
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">게임 참가</h2>
        <div className="space-y-4">
          <div className="text-gray-600">
            <p>Socket ID:</p>
            <p className="font-mono bg-gray-100 p-2 rounded break-all">
              {player.nickname || '연결 중...'}
            </p>
          </div>
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                닉네임
              </label>
              <input
                aria-label="nickname-input"
                type="text"
                onChange={handleNicknameChange}
                placeholder={player.nickname || '닉네임을 입력하세요'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2 mt-6">
              <button
                onClick={handleRegisterPlayer}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                입장하기
              </button>
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
