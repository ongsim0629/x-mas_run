import { useAtomValue } from 'jotai';
import { playerInfoAtom, playersAtom } from '../../atoms/PlayerAtoms';

const SkillCooldownIndicator = () => {
  const players = useAtomValue(playersAtom);
  const { id } = useAtomValue(playerInfoAtom);
  const localPlayer = players.find((player) => player.id === id);

  if (!localPlayer) return null;

  const { totalSkillCooldown, currentSkillCooldown, charType } = localPlayer;
  const progress =
    currentSkillCooldown > 0
      ? (currentSkillCooldown / totalSkillCooldown) * 100
      : 0;

  const remainingPercent = Math.round(100 - progress);
  const isReady = currentSkillCooldown <= 0;

  const getSkillInfo = (type: number) => {
    switch (type) {
      case 1:
        return {
          name: '순간 이동',
          icon: '/images/portal.svg',
          color: 'text-green-500',
        };
      case 2:
        return {
          name: '루돌프',
          icon: '/images/rudolph.svg',
          color: 'text-red-500',
        };
      case 3:
        return {
          name: '투명화',
          icon: '/images/ghost.svg',
          color: 'text-cyan-500',
        };
      default:
        return {
          name: '스킬',
          icon: '',
          color: 'text-yellow-500',
        };
    }
  };

  const skillInfo = getSkillInfo(charType);

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-gray-300 opacity-90" />
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 transform"
          viewBox="0 0 100 100"
        >
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
          <circle
            className={`transition-all duration-200 ${
              isReady ? skillInfo.color : 'text-gray-400'
            }`}
            strokeWidth="8"
            strokeDasharray={264}
            strokeDashoffset={264 * (progress / 100)}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={skillInfo.icon}
            alt={skillInfo.name}
            className={`w-8 h-8 ${isReady ? 'opacity-100' : 'opacity-40'}`}
          />
        </div>
      </div>

      <div
        className={`mt-2 font-bold ${
          isReady ? skillInfo.color : 'text-gray-400'
        }`}
      >
        {skillInfo.name}
      </div>

      <div className={isReady ? 'text-black' : 'text-gray-400'}>
        {isReady ? '사용 가능' : `${remainingPercent}%`}
      </div>

      <div className="mt-1 px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300">
        Q 버튼
      </div>
    </div>
  );
};

export default SkillCooldownIndicator;
