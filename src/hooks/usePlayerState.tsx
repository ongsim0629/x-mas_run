import { useSetAtom } from 'jotai';
import { playersAtom } from '../atoms/PlayerAtoms';
import { Position } from '../types/player';

type PlayerStateProps = {
  id: string;
};

const usePlayerState = (props: PlayerStateProps) => {
  const setPlayers = useSetAtom(playersAtom);

  const updatePlayerState = (pos: Position, vel: Position) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === props.id
          ? {
              ...player,
              position: {
                x: pos.x,
                y: pos.y,
                z: pos.z,
              },
              velocity: {
                x: vel.x,
                y: vel.y,
                z: vel.z,
              },
            }
          : player,
      ),
    );
  };

  return { updatePlayerState };
};
export default usePlayerState;
