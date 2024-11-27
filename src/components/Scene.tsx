import { Stage } from '@react-three/drei';
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
      <Stage
        environment={{
          files:
            'https://res.cloudinary.com/dkjk8h8zd/raw/upload/v1732709625/Venice_Sunset_1k_wohap7.hdr',
        }}
      />
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
