import { Environment } from '@react-three/drei';
import GroundMap from './map/Ground';
import RabbitController from './controller/RabbitController';
import { Physics } from '@react-three/rapier';
import { useAtomValue } from 'jotai';
import { playerInfoAtom, playersAtom } from '../atoms/PlayerAtoms';
import { useControls } from 'leva';
// import Map from './map/Map';

const maps = {
  castle_on_hills: {
    scale: 3,
    position: [0, -10, 0],
  },
  peach_castle: {
    scale: 0.5,
    position: [0, 0, 0],
  },
};

export default function Scene() {
  const players = useAtomValue(playersAtom);
  const { id: playerId } = useAtomValue(playerInfoAtom);
  const { map } = useControls('Map', {
    map: {
      value: 'peach_castle',
      options: Object.keys(maps),
    },
  });

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <Physics debug>
        {/* <Map
          scale={maps[map].scale}
          position={maps[map].position}
          model={`models/${map}.glb`}
        /> */}
        <GroundMap />
        {players.map((player) => (
          <RabbitController
            player={player}
            key={player.id}
            isLocalPlayer={player.id === playerId}
          />
        ))}
      </Physics>
    </>
  );
}
