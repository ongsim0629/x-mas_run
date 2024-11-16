import { Environment } from '@react-three/drei';
import GroundMap from './map/Ground';
import RabbitController from './controller/RabbitController';
import { Physics } from '@react-three/rapier';
import { useAtomValue } from 'jotai';
import { playersAtom } from '../atoms/PlayerAtoms';
import ExController from './controller/ExController';

export default function Scene() {
  const players = useAtomValue(playersAtom);
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <Physics debug>
        <GroundMap />
        {/* 꼬리 렌더링 확인 위해서 true로 임시 설정 */}
        <RabbitController hasTail={true} />
        {/* {players.map((player) => (
          <ExController player={player} key={player.id} />
        ))} */}
      </Physics>
    </>
  );
}
