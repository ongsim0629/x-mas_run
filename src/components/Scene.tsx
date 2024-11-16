import { Environment } from '@react-three/drei';
import GroundMap from './map/Ground';
import RabbitController from './controller/RabbitController';
import { Physics } from '@react-three/rapier';
import { useAtomValue } from 'jotai';
import { playerIdAtom, playersAtom } from '../atoms/PlayerAtoms';

export default function Scene() {
  const players = useAtomValue(playersAtom);
  const playerId = useAtomValue(playerIdAtom);
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <Physics debug>
        <GroundMap />
        {/* 꼬리 렌더링 확인 위해서 true로 임시 설정 */}
        {players.map((player) => {
          // console.log(player.id, playerId);

          return (
            <RabbitController
              player={player}
              key={player.id}
              isLocalPlayer={player.id === playerId}
            />
          );
        })}
      </Physics>
    </>
  );
}
