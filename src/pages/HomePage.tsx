import { useAtomValue, useAtom } from 'jotai';
import { gameScreenAtom } from '../atoms/GameAtoms';
import { GameScreen } from '../types/game';
import { playerInfoAtom } from '../atoms/PlayerAtoms';
import { Canvas } from '@react-three/fiber';
import { AnimatedRabbit } from '../models/AnimatedRabbit';
import { AnimatedGhost } from '../hooks/AnimatedGhost';
import { AnimatedSanta } from '../models/AnimatedSanta';
import { OrbitControls } from '@react-three/drei';
import { useState } from 'react';
import useSocket from '../hooks/useSocket';

const HomePage = () => {
  const { nickname } = useAtomValue(playerInfoAtom);
  const [, setGameScreen] = useAtom(gameScreenAtom);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const { socket } = useSocket();

  const handleGameStart = () => {
    if (!socket) return;
    socket.enterRoom(currentCharIndex + 1);
    setGameScreen(GameScreen.MATCHING);
  };

  const nextCharacter = () => {
    setCurrentCharIndex((prev) => (prev + 1) % 3);
  };

  const prevCharacter = () => {
    setCurrentCharIndex((prev) => (prev - 1 + 3) % 3);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <img
        src={import.meta.env.VITE_HOME_IMAGE_URL}
        alt="background"
        className="absolute w-full h-full object-cover blur-sm"
        fetchPriority="high"
      />
      <div className="inset-0 relative z-10 flex flex-col w-full h-full justify-between">
        <div className="flex items-center gap-2 m-4">
          <span className="flex flex-col justify-center items-center w-64 h-20 rounded-xl text-white border-6-pinkish-ivory border-4 bg-4-purple-light">
            <p className="text-lg font-semibold">{nickname}</p>
            <small>메리 크리스마스🎅🏻</small>
          </span>
        </div>
        <div className="relative flex items-center justify-center w-full h-full">
          <button
            onClick={prevCharacter}
            className="absolute left-4 z-20 p-4 rounded-full hover:scale-110 transition-all outline-none bg-5-purple-deep"
            aria-label="character-choose-left-button"
          >
            <img
              src="/images/leftArrow.svg"
              alt="left-Arrow"
              className="w-8 h-8"
            />
          </button>

          <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 5, 6]} intensity={1} />
            {currentCharIndex === 0 && (
              <AnimatedRabbit
                scale={0.8}
                animation="CharacterArmature|Yes"
                position={[0, -2, 0]}
                charColor="pink"
                nickName=" "
              />
            )}
            {currentCharIndex === 1 && (
              <AnimatedSanta
                scale={0.7}
                animation="Armature|happy Idle"
                position={[0, -2, 0]}
                charColor=" "
                nickName=" "
              />
            )}
            {currentCharIndex === 2 && (
              <AnimatedGhost
                scale={0.8}
                animation="CharacterArmature|Fast_Flying"
                position={[0, -2, 0]}
                charColor="gray"
                nickName=" "
              />
            )}
            <OrbitControls
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 3}
            />
          </Canvas>

          <button
            onClick={nextCharacter}
            className="absolute right-4 z-20 p-4 rounded-full hover:scale-110 transition-all outline-none bg-5-purple-deep"
            aria-label="character-choose-right-button"
          >
            <img
              src="/images/rightArrow.svg"
              alt="right-Arrow"
              className="w-8 h-8"
            />
          </button>
        </div>
        <div className="flex justify-end mb-8 mr-8">
          <button
            onClick={handleGameStart}
            className="bg-3-xmas-gold text-white text-3xl font-bold rounded-xl transition-colors min-w-56 min-h-16 p-4 border-6-pinkish-ivory border-4 hover:scale-110"
          >
            플레이!
          </button>
        </div>
      </div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-opacity-50 text-sm">
        캐릭터를 선택해주세요 🐰🎅🏻👻
      </div>
    </div>
  );
};

export default HomePage;
