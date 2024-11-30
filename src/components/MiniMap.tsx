import { useAtomValue } from 'jotai';
import {
  playerInfoAtom,
  playerRotationAtom,
  playersAtom,
} from '../atoms/PlayerAtoms';
import classNames from 'classnames';

const MiniMap = () => {
  const players = useAtomValue(playersAtom);
  const { id } = useAtomValue(playerInfoAtom);
  const rotation = useAtomValue(playerRotationAtom);

  const mapSize = 200;
  const scale = 0.005;

  return (
    <div className="absolute bottom-4 left-4 bg-black/40 rounded-lg p-2">
      <div className="relative w-[200px] h-[200px] border-2 border-white/30 rounded-lg overflow-hidden bg-black/20">
        {players
          .filter((player) => player.id === id || player.giftCnt > 0)
          .map((player) => {
            const xPos = (-player.position.x * scale + 0.5) * mapSize;
            const zPos = (-player.position.z * scale + 0.5) * mapSize;

            return (
              <div
                key={player.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${xPos}px`,
                  top: `${zPos}px`,
                }}
              >
                {player.id === id && (
                  <div
                    className="absolute w-11 h-11 bg-white/20 -z-10"
                    style={{
                      clipPath: 'polygon(50% 50%, 40% 0, 60% 0)',
                      transform: `translate(-50%, -50%) rotate(${-rotation}rad)`,
                      transition: 'transform 0.1s',
                      left: '50%',
                      top: '50%',
                    }}
                  />
                )}
                <div
                  className={classNames('absolute w-3 h-3 rounded-full', {
                    'bg-2-xmas-red': player.id === id,
                    'bg-3-xmas-gold': player.id !== id && player.giftCnt > 0,
                  })}
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MiniMap;
