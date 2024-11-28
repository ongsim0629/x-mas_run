import { Environment } from '@react-three/drei';
import RabbitController from '../controller/RabbitController';
import { Physics } from '@react-three/rapier';
import { useAtomValue } from 'jotai';
import { playerInfoAtom, playersAtom } from '../atoms/PlayerAtoms';
import Map from './map/Map';

export default function Scene() {
  const players = useAtomValue(playersAtom);
  const { id } = useAtomValue(playerInfoAtom);
  return (
    <>
      <Environment files={import.meta.env.VITE_INGAME_MAP_FILE} />
      <ambientLight intensity={0.3} />
      <Physics>
        <Map scale={0.1} position={[0, 0, 0]} model={`/maps/map.glb`} />
        {players.map((player) => (
          <RabbitController
            player={player}
            key={player.id}
            isLocalPlayer={player.id === id}
          />
        ))}
      </Physics>
    </>
  );
}
