import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { gameScreenAtom, nicknameAtom } from '../../atoms/GameAtoms';
import { GameScreen } from '../../types/game';
import { playerIdAtom } from '../../atoms/PlayerAtoms';

const LoadingPage = () => {
  const [, setGameScreen] = useAtom(gameScreenAtom);
  const [playerId] = useAtom(playerIdAtom);
  const [, setNickname] = useAtom(nicknameAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRandomNickname = async () => {
      if (!playerId) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('소켓 아이디 이걸로 랜덤 닉네임 받아올게용 ->', playerId);

        const response = await fetch(
          `${import.meta.env.VITE_DEV_SERVER_URL}/user/random-nickname`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: playerId }),
          },
        );

        const data = await response.json();
        console.log('생성된 랜덤 닉네임 ->', data.nickName);

        if (!response.ok) {
          throw new Error(data.msg || 'Failed to generate nickname.');
        }
        // 아톰값으로 랜덤 닉네임 설정!
        setNickname(data.nickName);
      } catch (err) {
        console.error('Error fetching nickname:', err);
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (!playerId) return;
    getRandomNickname();
    const timer = setTimeout(() => {
      // 일단 임의로 로딩 페이지
      setGameScreen(GameScreen.LOGIN);
    }, 3000);
    return () => clearTimeout(timer);
  }, [playerId]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Loading Game...</h1>
        <div className="w-32 h-32 relative">
          <div className="absolute inset-0 border-t-4 border-blue-200 border-solid rounded-full animate-spin" />
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default LoadingPage;
