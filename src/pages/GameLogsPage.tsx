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
          animation="CharacterArmature|Walk"
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
            <span className="w-full flex gap-2 justify-center items-center text-white text-5xl font-bold">
              <p className="">{result.character.nickName}</p>
              <p className="">의 플레이 💫</p>
            </span>
          </div>
          <div className="flex justify-between rounded-lg text-white mt-20 mx-10">
            <div className="bg-black/40 px-6 py-2 rounded-xl">
              <span className="flex justify-center items-center my-1 text-2xl font-bold ">
                받은 배지
              </span>
              <div className="h-2 border-b-4 w-80"></div>
              <ul className="my-5 flex">
                {result.badges.map((badge) => (
                  <li className="flex flex-col justify-center items-center gap-1">
                    <img
                      // src={badge.img}
                      src="https://res.cloudinary.com/dkjk8h8zd/image/upload/v1732902381/Premium_Quality_Badge_njwgzk.svg"
                      alt={`${badge.label}-badge`}
                      className="w-14 h-14"
                    />
                    <small className="font-semibold">{badge.label}</small>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-black/40 px-6 py-2 rounded-xl">
              <span className="flex justify-center items-center my-1 text-2xl font-bold">
                플레이 요약
              </span>
              <div className="h-2 border-b-4 w-80"></div>
              <ul className="my-5 flex flex-col gap-4">
                <li className="flex justify-between items-center w-full mx-1">
                  <div className="flex flex-col justify-center items-center gap-1">
                    <img
                      src="https://res.cloudinary.com/dkjk8h8zd/image/upload/v1732901653/Gift_Icons_1_obfynk.webp"
                      className="w-14 h-14"
                      alt="obtained-number-of-presents"
                    />
                    <small>{result.summary[0].label}</small>
                  </div>
                  <span className="text-5xl font-extrabold">
                    {result.summary[0].value}
                  </span>
                </li>
                <li className="flex justify-between items-center w-full mx-1">
                  <div className="flex flex-col justify-center items-center gap-1">
                    <img
                      src="https://res.cloudinary.com/dkjk8h8zd/image/upload/v1732901654/Christmas_Gift_Icon_hbrk9c.webp"
                      className="w-14 h-14"
                      alt="snatched-number-of-presents"
                    />
                    <small>{result.summary[1].label}</small>
                  </div>
                  <span className="text-5xl font-extrabold">
                    {result.summary[1].value}
                  </span>
                </li>
                <li className="flex justify-between items-center w-full mx-1">
                  <div className="flex flex-col justify-center items-center gap-1">
                    <img
                      src="https://res.cloudinary.com/dkjk8h8zd/image/upload/v1732901653/Gift_Icon_2_eezhtp.webp"
                      className="w-14 h-14"
                      alt="obtained-number-of-double"
                    />
                    <small>{result.summary[2].label}</small>
                  </div>
                  <span className="text-5xl font-extrabold">
                    {result.summary[2].value}
                  </span>
                </li>
                <li className="flex justify-between items-center w-full mx-1">
                  <div className="flex flex-col justify-center items-center gap-1">
                    <img
                      src="https://res.cloudinary.com/dkjk8h8zd/image/upload/v1732901654/Staff_Christmas_Icon_g6ktzp.webp"
                      className="w-14 h-14"
                      alt="obtained-number-of-triple"
                    />
                    <small>{result.summary[3].label}</small>
                  </div>
                  <span className="text-5xl font-extrabold">
                    {result.summary[3].value}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <Canvas
            camera={{ position: [0, 1, 5], fov: 45 }}
            className="-mt-[600px]"
          >
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
