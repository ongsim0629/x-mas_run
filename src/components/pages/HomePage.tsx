import { useAtomValue, useAtom } from 'jotai';
import { gameScreenAtom } from '../../atoms/GameAtoms';
import { GameScreen } from '../../types/game';
import { playerInfoAtom } from '../../atoms/PlayerAtoms';
import { Canvas } from '@react-three/fiber';
import { AnimatedRabbit } from '../models/AnimatedRabbit';
import { OrbitControls } from '@react-three/drei';

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
        className="absolute w-full h-full object-cover blur-sm"
      />
      <div className="inset-0 relative z-10 flex flex-col w-full h-full justify-around">
        <div className="flex items-center gap-2 m-4">
          <span className="flex flex-col justify-center items-center w-64 h-20 rounded-xl text-white border-6-pinkish-ivory border-4 bg-4-purple-light">
            <p className="text-lg font-semibold">{nickname}</p>
            <small>메리 크리스마스🎅🏻</small>
          </span>
        </div>
        <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 5, 6]} intensity={1} />
          <AnimatedRabbit
            scale={0.8}
            animation="CharacterArmature|Yes"
            position={[0, -2, 0]}
            bodyColor="pink"
            bellyColor="white"
            hairColor="pink"
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
            className="bg-3-xmas-gold text-white text-3xl font-bold rounded-xl transition-colors min-w-56 min-h-16 p-4 border-6-pinkish-ivory border-4 hover:scale-110"
          >
            플레이!
          </button>
        </div>
      </div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-opacity-50 text-sm">
        캐릭터를 선택해주세요 🐰🎅🏻🧌
      </div>
    </div>
  );
};

export default HomePage;
