import { Environment } from '@react-three/drei';
import { AnimatedRabbit } from './models/AnimatedRabbit';
import GroundMap from './map/Ground';

export default function Scene() {
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <GroundMap />
      <AnimatedRabbit />
    </>
  );
}
