import React, { useState } from 'react';
import { useAtomValue, useAtom } from 'jotai';
import { gameScreenAtom, nicknameAtom } from '../../atoms/GameAtoms';
import { GameScreen } from '../../types/game';

const HomePage = () => {
  const nickname = useAtomValue(nicknameAtom);
  const [, setGameScreen] = useAtom(gameScreenAtom);

  const handleGameStart = () => {
    setGameScreen(GameScreen.MATCHING);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">꼬리잡기</h1>
        <p className="text-xl text-white/80 mb-8">안녕하세요,{nickname}님!</p>
        <button
          onClick={handleGameStart}
          className="px-8 py-4 bg-green-500 text-white text-xl rounded-lg hover:bg-green-600 transition-colors"
        >
          게임 시작
        </button>
      </div>
    </div>
  );
};

export default HomePage;
