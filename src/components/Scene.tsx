import { Environment } from '@react-three/drei';
import GroundMap from './map/Ground';
import RabbitController from './controller/RabbitController';
import { Physics } from '@react-three/rapier';

export default function Scene() {
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <Physics debug>
        <GroundMap />
        <RabbitController />
      </Physics>
    </>
  );
}
