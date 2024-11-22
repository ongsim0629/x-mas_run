import { Environment } from '@react-three/drei';
import RabbitController from './controller/RabbitController';
import { Physics } from '@react-three/rapier';
import { useAtomValue } from 'jotai';
import { playerInfoAtom, playersAtom } from '../atoms/PlayerAtoms';
import { useControls } from 'leva';
import Map from './map/Map';
import { Vector3 } from 'three';

type MapConfig = {
  scale: number;
  position: Vector3 | [number, number, number] | undefined;
  model: string;
};

// maps 객체의 타입을 정의합니다
type Maps = {
  [key: string]: MapConfig;
};

const maps: Maps = {
  train_town: {
    scale: 0.1,
    position: [0, 0, 0],
    model: 'map.glb',
  },
};

export default function Scene() {
  const players = useAtomValue(playersAtom);
  const { id } = useAtomValue(playerInfoAtom);
  const { map } = useControls('Map', {
    map: {
      value: 'train_town',
      options: Object.keys(maps),
    },
  });
  const selectedMap = maps[map];

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <Physics debug>
        <Map
          scale={selectedMap.scale}
          position={selectedMap.position}
          model={`/maps/${selectedMap.model}`}
        />
        {/* <GroundMap /> */}
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
