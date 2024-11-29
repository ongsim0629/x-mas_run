import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { RapierRigidBody } from '@react-three/rapier';
import { degToRad, MathUtils } from 'three/src/math/MathUtils.js';
import { Group } from 'three';
import { Position } from '../types/player';
import { lerpAngle } from '../utils/movementCalc';
import useCharacterAnimation from './useCharacterAnimation';

type CharType = 1 | 2 | 3;
type CharacterControlConfig = {
  charType: CharType;
  rotationTarget: MutableRefObject<number>;
  mouseControlRef: MutableRefObject<any>;
  characterRotationTarget: MutableRefObject<number>;
  isPunching: MutableRefObject<boolean>;
  punchAnimationTimer: MutableRefObject<NodeJS.Timeout | null>;
  isCurrentlyStolen: MutableRefObject<boolean>;
  stolenAnimationTimer: MutableRefObject<NodeJS.Timeout | null>;
  setAnimation: Dispatch<SetStateAction<any>>;
  giftCnt: number;
  stolenMotion: boolean;
  speedMultiplier?: number;
  stealMotion: boolean;
  character: MutableRefObject<Group | null>;
  container: MutableRefObject<Group | null>;
  lastServerPosition: MutableRefObject<Position>;
  currentPosition: MutableRefObject<Position>;
  eventBlock: number;
  isSkillActive: boolean;
  totalSkillCooldown: number;
  currentSkillCooldown: number;
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
  charType,
  rotationTarget,
  mouseControlRef,
  characterRotationTarget,
  isPunching,
  punchAnimationTimer,
  setAnimation,
  giftCnt,
  stolenMotion,
  stealMotion,
  isCurrentlyStolen,
  stolenAnimationTimer,
  lastServerPosition,
  currentPosition,
  character,
  container,
  // eventBlock,
  // isSkillActive,
  // totalSkillCooldown,
  // currentSkillCooldown,
}: CharacterControlConfig) => {
  const STATIC_STATE = (vel: { x: number; y: number; z: number }) => ({
    velocity: vel,
    movement: { x: 0, y: 0, z: 0 },
    isMoving: false,
  });

  const { updateAnimation, playJumpAnimation, playPunchAnimation } =
    useCharacterAnimation({
      charType,
      stolenMotion,
      isCurrentlyStolen,
      stolenAnimationTimer,
      isPunching,
      punchAnimationTimer,
      stealMotion,
      giftCnt,
      setAnimation,
    });

  const updateMovement = (
    controls: Controls,
    rb: RapierRigidBody,
    isOnGround: boolean,
  ) => {
    const vel = rb.linvel();
    const pos = rb.translation();

    // 이거 하니까 플레이어 맞는 모션 안 보여서 일단 주석 처리 해뒀슴메도
    // if (eventBlock !== 0) return STATIC_STATE(vel);

    // 서버 위치 보정
    const distanceToServer = Math.sqrt(
      Math.pow(lastServerPosition.current.x - pos.x, 2) +
        Math.pow(lastServerPosition.current.z - pos.z, 2),
    );

    if (distanceToServer > import.meta.env.VITE_DISTANCE_THRESHOLD * 10) {
      currentPosition.current = { ...lastServerPosition.current };
      rb.setTranslation(lastServerPosition.current, true);

      const angle = Math.atan2(
        lastServerPosition.current.x - pos.x,
        lastServerPosition.current.z - pos.z,
      );
      const speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
      vel.x = Math.sin(angle) * speed;
      vel.z = Math.cos(angle) * speed;
      rb.setLinvel(vel, true);

      return STATIC_STATE(vel);
    }

    // 빼앗기는 상태 처리
    if (stolenMotion && !isCurrentlyStolen.current) {
      updateAnimation(vel);
      return STATIC_STATE(vel);
    }

    // 스틸 액션 처리
    if (controls.catch && !isPunching.current) {
      playPunchAnimation();
    }

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
    if (controls.jump) {
      if (pos.y >= 30) {
        vel.y +=
          import.meta.env.VITE_INGAME_GRAVITY *
          0.016 *
          import.meta.env.VITE_INGAME_EXTRA_GRAVITY;
      } else {
        vel.y = import.meta.env.VITE_INGAME_JUMP_FORCE;
      }
      playJumpAnimation();
    } else if (!isOnGround) {
      vel.y +=
        import.meta.env.VITE_INGAME_GRAVITY *
        0.016 *
        import.meta.env.VITE_INGAME_EXTRA_GRAVITY;
    }

    // 이동 처리
    const isMoving = movement.x !== 0 || movement.z !== 0;
    if (isMoving) {
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

    updateAnimation(vel);

    if (character.current) {
      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1,
      );
    }

    if (container.current) {
      container.current.rotation.y = MathUtils.lerp(
        container.current.rotation.y,
        rotationTarget.current,
        0.1,
      );
    }
    rb.setLinvel(vel, true);
    return {
      velocity: vel,
      movement,
      isMoving: movement.x !== 0 || movement.z !== 0,
    };
  };
  return { updateMovement };
};

export default useCharacterControl;
