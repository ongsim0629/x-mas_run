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
import { ItemType } from '../types/game';

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
  speed: number;
  items: ItemType[];
  itemDuration: { boost: number; shield: number };
  thunderEffect: number[];
};
const ROTATION_SPEED = degToRad(import.meta.env.VITE_INGAME_ROTATION_SPEED);
const JUMP_FORCE = import.meta.env.VITE_INGAME_JUMP_FORCE;
const MAX_HEIGHT = 30;
const GRAVITY_FORCE =
  import.meta.env.VITE_INGAME_GRAVITY *
  0.016 *
  import.meta.env.VITE_INGAME_EXTRA_GRAVITY;
const DISTANCE_THRESHOLD_SQ = Math.pow(
  import.meta.env.VITE_DISTANCE_THRESHOLD,
  2,
);

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
  speed,
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
  const setPlayerRotation = useSetAtom(playerRotationAtom);
  const getControls = useKeyControl();
  const controls = getControls();

  const updateMovement = (rb: RapierRigidBody) => {
    const vel = rb.linvel();
    const pos = rb.translation();
    const isOnGround = Math.abs(vel.y) < 0.1;

    if (isSkillActive) {
      switch (charType) {
        case 1:
          rb.setTranslation(position, true);
          break;
        case 2:
          break;
        case 3:
          break;
        default:
          break;
      }
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
      const zeroVel = { x: 0, y: vel.y, z: 0 };
      rb.setLinvel(zeroVel, true);
      return;
    }

    // 서버 위치 보정
    const distanceSquared =
      Math.pow(position.x - pos.x, 2) + Math.pow(position.z - pos.z, 2);

    if (distanceSquared > DISTANCE_THRESHOLD_SQ) {
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
      rotationTarget.current += ROTATION_SPEED * movement.x;
    }

    // 점프 처리
    if (controls.jump) {
      if (pos.y >= MAX_HEIGHT) {
        vel.y += GRAVITY_FORCE;
      } else {
        vel.y = JUMP_FORCE;
      }
      playJumpAnimation();
    } else if (!isOnGround) {
      vel.y += GRAVITY_FORCE;
    }

    // 이동 처리
    const isMoving = movement.x !== 0 || movement.z !== 0;
    if (isMoving) {
      // 캐릭터 회전
      characterRotationTarget.current = Math.atan2(movement.x, movement.z);
      const totalRotation =
        rotationTarget.current + characterRotationTarget.current;
      vel.x = Math.sin(totalRotation) * speed;
      vel.z = Math.cos(totalRotation) * speed;
    }

    updateAnimation(vel);

    if (character.current) {
      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1,
      );
      setPlayerRotation(rotationTarget.current + character.current.rotation.y);
    }

    if (container.current) {
      container.current.rotation.y = MathUtils.lerp(
        container.current.rotation.y,
        rotationTarget.current,
        0.1,
      );
    }
    rb.setLinvel(vel, true);

    if (pos.x !== position.x || pos.y !== position.y || pos.z !== position.z) {
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
    }
  };
  return { updateMovement };
};

export default useCharacterControl;
