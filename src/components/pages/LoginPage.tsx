import React, { useEffect, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { playerIdAtom } from '../../atoms/PlayerAtoms';
import { gameScreenAtom, nicknameAtom } from '../../atoms/GameAtoms';
import { GameScreen } from '../../types/game';

const LoginPage = () => {
  const playerId = useAtomValue(playerIdAtom);
  const serverNickname = useAtomValue(nicknameAtom);
  const [customNickname, setCustomNickname] = useState<string>('');
  const setNickname = useSetAtom(nicknameAtom);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setGameScreen = useSetAtom(gameScreenAtom);

  // 게임 시작 함수
  const handleGameStart = async () => {
    if (!playerId) return;
    const nickname = customNickname.trim() || serverNickname; // 입력값이 없으면 서버 닉네임 사용

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_DEV_SERVER_URL}/user/enter`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: playerId,
            nickName: nickname,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || '게임 입장에 실패했습니다.');
      }
      setNickname(nickname);
      setGameScreen(GameScreen.HOME);
    } catch (err) {
      console.error('Error entering game:', err);
      setError(
        err instanceof Error ? err.message : '게임 입장에 실패했습니다.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">게임 참가</h2>
        <div className="space-y-4">
          <div className="text-gray-600">
            <p>Socket ID:</p>
            <p className="font-mono bg-gray-100 p-2 rounded break-all">
              {playerId || '연결 중...'}
            </p>
            <p className="font-mono bg-gray-100 p-2 rounded break-all">
              {serverNickname || '연결 중...'}
            </p>
          </div>

          {isLoading ? (
            <p className="text-center text-blue-600">처리 중...</p>
          ) : (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  닉네임
                </label>
                <input
                  type="text"
                  value={customNickname}
                  onChange={(e) => setCustomNickname(e.target.value)}
                  placeholder={
                    serverNickname ? `${serverNickname}` : '닉네임을 입력하세요'
                  } 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <p className="text-red-600 text-center text-sm">{error}</p>
              )}

              <div className="space-y-2 mt-6">
                <button
                  onClick={handleGameStart}
                  disabled={isLoading || !playerId}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  게임 시작
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
