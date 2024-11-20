import { MathUtils } from 'three';

export const normalizeAngle = (angle: any) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};
export const lerpAngle = (start: any, end: any, t: any) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) start += 2 * Math.PI;
    else end += 2 * Math.PI;
  }
  return normalizeAngle(start + (end - start) * t);
};

export const lerpPosition = (current: number, target: number) => {
  const distance = Math.abs(current - target);
  const factor = Math.min(
    import.meta.env.VITE_POSITION_LERP_FACTOR * (1 + distance * 0.1),
    1,
  );
  return MathUtils.lerp(current, target, factor);
};

export const isMovingSignificantly = (vel: {
  x: number;
  y: number;
  z: number;
}) => {
  return (
    Math.abs(vel.x) > import.meta.env.VITE_POSITION_THRESHOLD ||
    Math.abs(vel.z) > import.meta.env.VITE_POSITION_THRESHOLD
  );
};
