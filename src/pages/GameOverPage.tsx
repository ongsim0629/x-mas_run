import { useAtom, useAtomValue } from 'jotai';
import { gameScreenAtom, roomIdAtom } from '../atoms/GameAtoms';
import { GameScreen, Winner } from '../types/game';
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AnimatedRabbit } from '../models/AnimatedRabbit';
import { Group } from 'three';
import useGame from '../hooks/useGame';
import { AnimatedSanta } from '../models/AnimatedSanta';
import { AnimatedGhost } from '../hooks/AnimatedGhost';

const RotatingWinner = ({
  charType,
  charColor,
}: {
  charType: number;
  charColor: string;
}) => {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 5, 30]} intensity={1} />
      {charType === 1 && (
        <AnimatedRabbit
          scale={0.8}
          animation="CharacterArmature|Wave"
          position={[0, -2, 0]}
          charColor={charColor}
          nickName={' '}
        />
      )}
      {charType === 2 && (
        <AnimatedSanta
          scale={0.8}
          animation="Armature|Excited"
          position={[0, -2, 0]}
          charColor={charColor}
          nickName={' '}
        />
      )}
      {charType === 3 && (
        <AnimatedGhost
          scale={0.8}
          animation="CharacterArmature|Yes"
          position={[0, -2, 0]}
          charColor={charColor}
          nickName={' '}
        />
      )}
    </group>
  );
};

const GameOverPage = () => {
  const [, setGameScreen] = useAtom(gameScreenAtom);
  const roomId = useAtomValue(roomIdAtom);
  const { winnerQuery } = useGame();
  const [winner, setWinner] = useState<Winner>({
    id: '',
    nickName: '',
    charType: 1,
    charColor: 'pink',
  });

  useEffect(() => {
    const fetchWinner = async () => {
      const res = await winnerQuery(roomId);
      setWinner(res);
    };
    fetchWinner();
  }, [winnerQuery, setWinner, roomId]);

  const handleGoHome = () => {
    setGameScreen(GameScreen.HOME);
  };

  const handlePlayAgain = () => {
    setGameScreen(GameScreen.HOME);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <img
        src={import.meta.env.VITE_GAME_OVER_IMAGE_URL}
        alt="background"
        className="absolute w-full h-full object-cover"
        fetchPriority="high"
      />
      <div className="inset-0 relative z-10 flex flex-col w-full h-full justify-around">
        <div className="flex flex-col items-center gap-2 mt-10">
          <span className="w-full flex flex-col justify-center items-center text-white text-xl font-bold">
            {winner.nickName}
          </span>
          <span className="w-full flex justify-center items-center text-white text-8xl font-bold">
            <p>우승</p>
            <img
              src="/images/exclamation.svg"
              alt="exclamation Mark"
              className="w-20 h-20"
            />
          </span>
        </div>
        <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
          <RotatingWinner
            charColor={winner.charColor}
            charType={winner.charType}
          />
        </Canvas>
        <div className="flex justify-between">
          <button
            onClick={handlePlayAgain}
            className="bg-white text-xl font-semibold rounded-tr-xl transition-colors min-w-56 min-h-16 p-4 hover:scale-110"
            type="button"
            aria-label="play-agin"
          >
            한판 더?
          </button>
          <button
            onClick={handleGoHome}
            className="bg-black text-white text-xl font-semibold rounded-tl-xl transition-colors min-w-56 min-h-16 p-4 hover:scale-110"
            type="button"
            aria-label="goback-home"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverPage;
