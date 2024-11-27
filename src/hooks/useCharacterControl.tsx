import { useAtom } from 'jotai';
import { MutableRefObject } from 'react';
import { playAudioAtom } from '../atoms/GameAtoms';
import { RapierRigidBody } from '@react-three/rapier';
import { degToRad } from 'three/src/math/MathUtils.js';

type CharacterControlConfig = {
  rotationTarget: MutableRefObject<number>;
  mouseControlRef: MutableRefObject<any>;
  characterRotationTarget: MutableRefObject<number>;
  isPunching: MutableRefObject<boolean>;
  punchAnimationTimer: MutableRefObject<NodeJS.Timeout | null>;
  setAnimation: (animation: string) => void;
  giftCnt: number;
};
type Controls = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  catch: boolean;
};
const useCharacterControl = ({
  rotationTarget,
  mouseControlRef,
  characterRotationTarget,
  isPunching,
  punchAnimationTimer,
  setAnimation,
  giftCnt,
}: CharacterControlConfig) => {
  const [, playAudio] = useAtom(playAudioAtom);
  const updateMovement = (
    controls: Controls,
    rb: RapierRigidBody,
    isOnGround: boolean,
  ) => {
    const vel = rb.linvel();
    const movement = { x: 0, y: 0, z: 0 };
    // 기본 이동 방향 설정
    if (controls.forward) movement.z = 1;
    if (controls.backward) movement.z = -1;
    if (controls.left) movement.x = 1;
    if (controls.right) movement.x = -1;

    // 회전 처리
    if (movement.x !== 0 && !mouseControlRef.current?.isLocked) {
      rotationTarget.current +=
        degToRad(import.meta.env.VITE_INGAME_ROTATION_SPEED) * movement.x;
    }

    // 점프 처리
    if (controls.jump && isOnGround) {
      playAudio('jump');
      vel.y = import.meta.env.VITE_INGAME_JUMP_FORCE;
      setAnimation('CharacterArmature|Jump');
    }

    // 스틸 액션 처리
    if (controls.catch && !isPunching.current) {
      playAudio('punch');
      isPunching.current = true;
      setAnimation('CharacterArmature|Punch');
      punchAnimationTimer.current = setTimeout(
        () => (isPunching.current = false),
        500,
      );
    }

    // 이동 방향이 있을 때만 캐릭터 회전과 속도 계산
    if (movement.x !== 0 || movement.z !== 0) {
      // 캐릭터 회전
      characterRotationTarget.current = Math.atan2(movement.x, movement.z);

      // 속도 계산 (선물 개수에 따른 감속 포함)
      const speedReduction = Math.max(0.5, 1 - giftCnt * 0.1);
      const currentSpeed = import.meta.env.VITE_INGAME_SPEED * speedReduction;

      vel.x =
        Math.sin(rotationTarget.current + characterRotationTarget.current) *
        currentSpeed;
      vel.z =
        Math.cos(rotationTarget.current + characterRotationTarget.current) *
        currentSpeed;
    }

    return {
      velocity: vel,
      movement,
      isMoving: movement.x !== 0 || movement.z !== 0,
    };
  };
  return { updateMovement };
};

export default useCharacterControl;
