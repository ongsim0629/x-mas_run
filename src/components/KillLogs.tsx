import { useAtomValue } from 'jotai';
import { killLogsAtom } from '../atoms/GameAtoms';

const KillLogs = () => {
  const kilLogs = useAtomValue(killLogsAtom);

  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 pointer-events-none">
      {kilLogs.map((log, index) => (
        <div
          key={`kill-log-${index}`}
          className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg whitespace-nowrap text-base animate-slideIn"
        >
          {log.victim.nickName}선물을 {log.actor.nickName}가 빼앗았습니다👻
        </div>
      ))}
    </div>
  );
};
export default KillLogs;
