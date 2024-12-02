import { useState, useEffect } from 'react';
import cls from 'classnames';

type KeyboardMapProps = {
  getKeyClass: (key: string) => string;
  keyMap: string[];
  movement: string[];
  steal: string;
  skill: string;
};

const KeyboardMap = ({
  getKeyClass,
  keyMap,
  movement,
  steal,
  skill,
}: KeyboardMapProps) => {
  return (
    <div className="w-full flex justify-center gap-20 items-end">
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-8 text-white">
          <div className="flex flex-col gap-1">
            <div className="flex justify-center">
              <div className={cls(`w-10 h-10 ${getKeyClass(keyMap[0])}`)}>
                {movement[0]}
              </div>
            </div>
            <div className="flex gap-1">
              <div className={cls(`w-10 h-10 ${getKeyClass(keyMap[1])}`)}>
                {movement[1]}
              </div>
              <div className={cls(`w-10 h-10 ${getKeyClass(keyMap[2])}`)}>
                {movement[2]}
              </div>
              <div className={cls(`w-10 h-10 ${getKeyClass(keyMap[3])}`)}>
                {movement[3]}
              </div>
            </div>
          </div>
        </div>
        <span className="text-sm text-white/70">이동하기</span>
      </div>

      <div className="flex gap-10 items-end text-white">
        <div className="flex flex-col items-center gap-2">
          <div className={cls(`w-32 h-10 ${getKeyClass('Space')}`)}>Space</div>
          <span className="text-sm text-white/70">점프하기</span>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex gap-2">
          <div className={cls(`w-20 h-10 ${getKeyClass(keyMap[4])}`)}>
            {steal}
          </div>
          <div className="flex items-center text-2xl text-white/50 mx-2">
            or
          </div>
          <div className={cls(`w-16 h-10 ${getKeyClass('KeyE')}`)}>E</div>
        </div>
        <span className="text-sm text-white/70">선물 훔치기</span>
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        <div className={cls(`w-16 h-10 ${getKeyClass(keyMap[5])}`)}>
          {skill}
        </div>
        <span className="text-sm text-white/70">스킬</span>
      </div>
    </div>
  );
};

const KeyboardGuide = () => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mode, setMode] = useState<'keyboard' | 'mouse'>('mouse'); // 현재 모드 상태

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      setPressedKeys((prev) => new Set(prev).add(e.code));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const getKeyClass = (key: string) => {
    const isActive = key === 'Mouse' ? isMouseDown : pressedKeys.has(key);
    return cls(`
      flex items-center justify-center
      bg-white/10 backdrop-blur-sm
      rounded-lg border border-white/20
      font-bold animate-key-shine
      ${isActive ? 'bg-yellow-300/30' : ''}
    `);
  };

  return (
    <div
      className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col gap-10 w-full text-white z-50"
      aria-label="key-control-guide"
    >
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMode('mouse');
          }}
          className={cls(
            'px-4 py-2 rounded-lg font-bold outline-none',
            mode === 'mouse' ? 'bg-3-xmas-gold text-white' : 'bg-gray-300/30',
          )}
        >
          마우스 모드
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMode('keyboard');
          }}
          className={cls(
            'px-4 py-2 rounded-lg font-bold outline-none',
            mode === 'keyboard'
              ? 'bg-3-xmas-gold text-white'
              : 'bg-gray-300/30',
          )}
        >
          키보드 모드
        </button>
      </div>
      {mode === 'mouse' ? (
        <KeyboardMap
          getKeyClass={getKeyClass}
          keyMap={['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'KeyQ']}
          movement={['W', 'A', 'S', 'D']}
          steal="Shift"
          skill="Q"
        />
      ) : (
        <KeyboardMap
          getKeyClass={getKeyClass}
          keyMap={[
            'ArrowUp',
            'ArrowLeft',
            'ArrowDown',
            'ArrowRight',
            'Mouse',
            'KeyQ',
          ]}
          movement={['↑', '←', '↓', '→']}
          steal="Click"
          skill="Q"
        />
      )}
    </div>
  );
};

export default KeyboardGuide;
