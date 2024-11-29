import { useAtomValue } from 'jotai';
import { KillComboLogsAtom, killLogsAtom } from '../atoms/GameAtoms';

const KillLogs = () => {
  const kilLogs = useAtomValue(killLogsAtom);
  const comboLogs = useAtomValue(KillComboLogsAtom);

  return (
    <>
      <div className="fixed top-20 right-1/2 translate-x-1/2 flex flex-col gap-2 pointer-events-none">
        {comboLogs.map(({ actor: { nickName, combo } }, index) => {
          let message = '';
          if (combo === 'double') message = '더블';
          else if (combo === 'triple') message = '트리플';
          else message = '미쳐버린';
          return (
            <div
              key={`combo-log-${index}`}
              className="text-5xl animate-slideIn font-extrabold"
            >
              <span
                className="text-1-xmas-green"
                style={{
                  textShadow: `
      2px 2px 0 white, 
      -2px -2px 0 white, 
      2px -2px 0 white, 
      -2px 2px 0 white
    `,
                }}
              >
                {nickName}의{' '}
              </span>
              <span
                className="text-2-xmas-red"
                style={{
                  textShadow: `
      2px 2px 0 white, 
      -2px -2px 0 white, 
      2px -2px 0 white, 
      -2px 2px 0 white
    `,
                }}
              >
                {message} CATCH!
              </span>
            </div>
          );
        })}
      </div>
      <div className="fixed top-1/2 right-5 flex flex-col gap-2 pointer-events-none">
        {kilLogs.map((log, index) => (
          <div
            key={`kill-log-${index}`}
            className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg whitespace-nowrap text-base animate-slideIn"
          >
            {log.victim.nickName}(이)의 선물을 {log.actor.nickName}(이)가
            빼앗았습니다👻
          </div>
        ))}
      </div>
    </>
  );
};
export default KillLogs;
