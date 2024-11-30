import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { RapierRigidBody } from '@react-three/rapier';
import { degToRad, MathUtils } from 'three/src/math/MathUtils.js';
import { Group } from 'three';
import { Position } from '../types/player';
import { lerpAngle } from '../utils/movementCalc';
import useCharacterAnimation from './useCharacterAnimation';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  playerInfoAtom,
  playerRotationAtom,
  playersAtom,
} from '../atoms/PlayerAtoms';
import useKeyControl from './useKeyControl';

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
  position: Position;
  eventBlock: number;
  isSkillActive: boolean;
  totalSkillCooldown: number;
  currentSkillCooldown: number;
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
  position,
  character,
  container,
  eventBlock,
  isSkillActive,
  // totalSkillCooldown,
  // currentSkillCooldown,
  speedMultiplier = 1,
}: CharacterControlConfig) => {
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

  const setPlayers = useSetAtom(playersAtom);
  const { id } = useAtomValue(playerInfoAtom);
  const setPlayerRoation = useSetAtom(playerRotationAtom);
  const getControls = useKeyControl();
  const controls = getControls();

  const updateMovement = (rb: RapierRigidBody) => {
    const vel = rb.linvel();
    const pos = rb.translation();
    const isOnGround = Math.abs(rb.linvel().y) < 0.1;

    if (isSkillActive) {
      rb.setTranslation(position, true);
    }

    // 빼앗기는 상태 처리
    if (stolenMotion && !isCurrentlyStolen.current) {
      updateAnimation(vel);
      return;
    }

    // 스틸 액션 처리
    if (controls.catch && !isPunching.current) {
      playPunchAnimation();
    }

    if (eventBlock !== 0) {
      const zeroVel = { x: 0, y: 0, z: 0 };
      rb.setLinvel(zeroVel, true);
      return;
    }

    // 서버 위치 보정
    const distanceToServer = Math.sqrt(
      Math.pow(position.x - pos.x, 2) + Math.pow(position.z - pos.z, 2),
    );

    if (distanceToServer > import.meta.env.VITE_DISTANCE_THRESHOLD) {
      rb.setTranslation(position, true);

      const angle = Math.atan2(position.x - pos.x, position.z - pos.z);
      const speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
      vel.x = Math.sin(angle) * speed;
      vel.z = Math.cos(angle) * speed;
      rb.setLinvel(vel, true);

      setPlayers((prev) =>
        prev.map((player) =>
          player.id === id
            ? {
                ...player,
                position: { ...position },
                velocity: { ...vel },
              }
            : player,
        ),
      );
      return;
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
      const baseSpeed = import.meta.env.VITE_INGAME_SPEED;
      const currentSpeed = baseSpeed * speedReduction * speedMultiplier;

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
      setPlayerRoation(rotationTarget.current + character.current.rotation.y);
    }

    if (container.current) {
      container.current.rotation.y = MathUtils.lerp(
        container.current.rotation.y,
        rotationTarget.current,
        0.1,
      );
    }
    rb.setLinvel(vel, true);

    setPlayers((prev) =>
      prev.map((player) =>
        player.id === id
          ? {
              ...player,
              position: { x: pos.x, y: pos.y, z: pos.z },
              velocity: { ...vel },
            }
          : player,
      ),
    );
  };
  return { updateMovement };
};

export default useCharacterControl;
