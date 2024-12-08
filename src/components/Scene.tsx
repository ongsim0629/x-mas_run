import { lazy, memo } from 'react';
import { Environment } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { useAtomValue } from 'jotai';
import { playerInfoAtom, playersAtom } from '../atoms/PlayerAtoms';
import Map from './map/Map';
import { gameItemsAtom } from '../atoms/GameAtoms';
import { ItemBox } from '../models/ItemBox';
const RabbitController = lazy(() => import('../controller/RabbitController'));
const SantaController = lazy(() => import('../controller/SantaController'));
const GhostController = lazy(() => import('../controller/GhostController'));

const ItemBoxes = memo(
  ({ items, colors }: { items: any[]; colors: string[] }) => (
    <>
      {items.map((item, index) => (
        <ItemBox
          key={item.id}
          position={item.position}
          color={colors[index % colors.length]}
        />
      ))}
    </>
  ),
);
const Players = memo(
  ({
    players,
    localPlayerId,
  }: {
    players: any[];
    localPlayerId: string | null | undefined;
  }) => {
    return (
      <>
        {players.map((player) => {
          const isLocalPlayer = player.id === localPlayerId;

          switch (player.charType) {
            case 1:
              return (
                <RabbitController
                  player={player}
                  key={player.id}
                  isLocalPlayer={isLocalPlayer}
                />
              );
            case 2:
              return (
                <SantaController
                  player={player}
                  key={player.id}
                  isLocalPlayer={isLocalPlayer}
                />
              );
            case 3:
              return (
                <GhostController
                  player={player}
                  key={player.id}
                  isLocalPlayer={isLocalPlayer}
                />
              );
            default:
              return null;
          }
        })}
      </>
    );
  },
);

export default function Scene() {
  const players = useAtomValue(playersAtom);
  const gameItems = useAtomValue(gameItemsAtom);
  const { id } = useAtomValue(playerInfoAtom);
  const colors = ['red', 'green', 'gold'];
  return (
    <>
      <Environment files={import.meta.env.VITE_INGAME_MAP_FILE} />
      <ambientLight intensity={0.3} />
      <Physics timeStep={1 / 30} colliders={false}>
        <Map scale={0.1} position={[0, 0, 0]} model={`/maps/map.glb`} />
        <ItemBoxes items={gameItems} colors={colors} />
        <Players players={players} localPlayerId={id} />
      </Physics>
    </>
  );
}
