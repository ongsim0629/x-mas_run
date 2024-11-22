import { useAtomValue, useAtom } from 'jotai';
import { gameScreenAtom } from '../../atoms/GameAtoms';
import { GameScreen } from '../../types/game';
import { playerInfoAtom } from '../../atoms/PlayerAtoms';
import { Canvas } from '@react-three/fiber';
import { AnimatedRabbit } from '../models/AnimatedRabbit';
import { OrbitControls, Text } from '@react-three/drei';

const HomePage = () => {
  const { nickname } = useAtomValue(playerInfoAtom);
  const [, setGameScreen] = useAtom(gameScreenAtom);

  const handleGameStart = () => {
    setGameScreen(GameScreen.MATCHING);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <img
        src={import.meta.env.VITE_HOME_IMAGE_URL}
        alt="background"
        className="absolute w-full h-full object-cover"
      />
      <div className="inset-0 relative z-10 flex flex-col w-full h-full justify-around">
        <div className="flex items-center gap-2 m-2">
          <img src={import.meta.env.VITE_SOCKS_IMAGE_URL} className="w-32" />
          <span className="flex flex-col justify-center items-center w-64 h-20 rounded-xl text-white border-white border-4 bg-gradient-to-b from-purple-500 to-blue-500">
            <p className="text-lg font-semibold">{nickname}</p>
            <small>메리 크리스마스🎅🏻</small>
          </span>
        </div>
        {/* <span className="flex justify-center fixed right-1/2 translate-x-1/2 top-1/4 text-2xl text-white">
          토끼🐰와 함께?!
        </span> */}
        <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 5, 6]} intensity={1} />
          <AnimatedRabbit
            scale={0.8}
            animation="CharacterArmature|Yes"
            position={[0, -2, 0]}
            bodyColor="#fc504d"
            bellyColor="#fc504d"
            hairColor="#fc504d"
            nickName={' '}
          />
          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
        <div className="flex justify-end m-10">
          <button
            onClick={handleGameStart}
            className="bg-gradient-to-b from-purple-500 to-yellow-500 text-white text-3xl font-bold rounded-xl transition-colors min-w-56 min-h-16 p-4 border-white border-4 hover:scale-110"
          >
            플레이!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
