import { useEffect, useState } from 'react';
import cls from 'classnames';

const KeyboardGuide = () => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [isMouseDown, setIsMouseDown] = useState(false);

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
      className={cls(`
        absolute bottom-20 left-1/2 -translate-x-1/2
        flex items-end gap-12
      `)}
      aria-label="key-control-guide"
    >
      <div className={cls(`flex flex-col items-center gap-2`)}>
        <div className={cls(`flex gap-8 text-white`)}>
          <div className={cls(`flex flex-col gap-1`)}>
            <div className={cls(`flex justify-center`)}>
              <div className={cls(`w-10 h-10 ${getKeyClass('KeyW')}`)}>W</div>
            </div>
            <div className={cls(`flex gap-1`)}>
              <div className={cls(`w-10 h-10 ${getKeyClass('KeyA')}`)}>A</div>
              <div className={cls(`w-10 h-10 ${getKeyClass('KeyS')}`)}>S</div>
              <div className={cls(`w-10 h-10 ${getKeyClass('KeyD')}`)}>D</div>
            </div>
          </div>
          <div className={cls(`flex items-center text-2xl text-white/50`)}>
            or
          </div>
          <div className={cls(`flex flex-col gap-1`)}>
            <div className={cls(`flex justify-center`)}>
              <div className={cls(`w-10 h-10 ${getKeyClass('ArrowUp')}`)}>
                ↑
              </div>
            </div>
            <div className={cls(`flex gap-1`)}>
              <div className={cls(`w-10 h-10 ${getKeyClass('ArrowLeft')}`)}>
                ←
              </div>
              <div className={cls(`w-10 h-10 ${getKeyClass('ArrowDown')}`)}>
                ↓
              </div>
              <div className={cls(`w-10 h-10 ${getKeyClass('ArrowRight')}`)}>
                →
              </div>
            </div>
          </div>
        </div>
        <span className={cls(`text-sm text-white/70`)}>이동하기</span>
      </div>

      <div className={cls(`flex gap-10 items-end text-white`)}>
        <div className={cls(`flex flex-col items-center gap-2`)}>
          <div className={cls(`w-32 h-10 ${getKeyClass('Space')}`)}>Space</div>
          <span className={cls(`text-sm text-white/70`)}>점프하기</span>
        </div>
      </div>
      <div className={cls(`flex flex-col justify-center items-center gap-2`)}>
        <div className={cls(`flex gap-2`)}>
          <div className={cls(`w-16 h-10 ${getKeyClass('ShiftLeft')}`)}>
            Shift
          </div>
          <div className={cls(`flex items-center text-2xl text-white/50 mx-2`)}>
            or
          </div>
          <div className={cls(`w-10 h-10 ${getKeyClass('KeyE')}`)}>E</div>
          <div className={cls(`flex items-center text-2xl text-white/50 mx-2`)}>
            or
          </div>
          <div className={cls(`w-10 h-10 ${getKeyClass('Mouse')}`)}>🖱️</div>
        </div>
        <span className={cls(`text-sm text-white/70`)}>선물 훔치기</span>
      </div>
    </div>
  );
};

export default KeyboardGuide;
