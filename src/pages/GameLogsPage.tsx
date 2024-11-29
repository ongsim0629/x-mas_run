import { useAtom, useAtomValue } from 'jotai';
import { gameScreenAtom, roomIdAtom } from '../atoms/GameAtoms';
import { useEffect, useState } from 'react';
import { playerInfoAtom } from '../atoms/PlayerAtoms';
import useGame from '../hooks/useGame';
import { MyGameResult } from '../types/player';
import { AnimatedRabbit } from '../models/AnimatedRabbit';
import { AnimatedSanta } from '../models/AnimatedSanta';
import { AnimatedGhost } from '../hooks/AnimatedGhost';
import { GameScreen } from '../types/game';
import { Canvas } from '@react-three/fiber';
const RotatingWinner = ({
  charType,
  charColor,
}: {
  charType: number;
  charColor: string;
}) => {
  return (
    <group>
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
          animation="Armature|happy Idle"
          position={[0, -2, 0]}
          charColor={charColor}
          nickName={' '}
        />
      )}
      {charType === 3 && (
        <AnimatedGhost
          scale={0.8}
          animation="CharacterArmature|Flying_Idle"
          position={[0, -2, 0]}
          charColor={charColor}
          nickName={' '}
        />
      )}
    </group>
  );
};

const GameLogsPage = () => {
  const [, setGameScreen] = useAtom(gameScreenAtom);
  const [result, setResult] = useState<MyGameResult | null>(null);
  const roomId = useAtomValue(roomIdAtom);
  const { id } = useAtomValue(playerInfoAtom);
  const { myGameResultQuery } = useGame();
  useEffect(() => {
    const fetchMyResult = async () => {
      if (!id) return;
      const res = await myGameResultQuery({ roomId, userId: id });
      setResult(res);
    };
    fetchMyResult();
  }, []);

  const handleGoHome = () => setGameScreen(GameScreen.HOME);
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <img
        src="https://res.cloudinary.com/dkjk8h8zd/image/upload/v1732899211/original-d2f44765653571b8cf6a54584a6f092e_sfrv1p.webp"
        alt="background"
        className="absolute w-full h-full object-cover"
      />
      {result && (
        <div className="inset-0 relative z-10 flex flex-col w-full h-full justify-around">
          <div className="flex flex-col items-center gap-2 mt-10">
            <span className="w-full flex flex-col justify-center items-center text-white text-5xl font-bold">
              플레이 요약💫
            </span>
          </div>
          <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
            <RotatingWinner
              charColor={result.character.charColor}
              charType={result.character.charType}
            />
          </Canvas>
          <div className="flex justify-between">
            <div></div>
            <button
              onClick={handleGoHome}
              className="bg-white text-xl font-semibold rounded-tl-xl transition-colors min-w-56 min-h-16 p-4 hover:scale-110"
              type="button"
              aria-label="goback-home"
            >
              돌아가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLogsPage;
