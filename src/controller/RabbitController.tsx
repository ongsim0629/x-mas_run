import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { useEffect, useRef, useState } from 'react';
import { AnimatedRabbit, RabbitActionName } from '../models/AnimatedRabbit';
import { MathUtils } from 'three/src/math/MathUtils.js';
import { Group, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Character } from '../types/player';
import { useSetAtom } from 'jotai';
import { playersAtom } from '../atoms/PlayerAtoms';
import { isMovingSignificantly, lerpAngle } from '../utils/movementCalc';
import { Present } from '../components/present';
import useKeyControl from '../hooks/useKeyControl';
import useCharacterControl from '../hooks/useCharacterControl';
import useCharacterAnimation from '../hooks/useCharacterAnimation';
import useCamera from '../hooks/useCamera';
import usePlayerState from '../hooks/usePlayerState';
import useMouseRotation from '../hooks/useMouseRotation';

interface RabbitControllerProps {
  player: Character;
  isLocalPlayer?: boolean;
}

const RabbitController = ({
  player: {
    id,
    giftCnt,
    position,
    velocity,
    nickName,
    charColor,
    steal,
    isBeingStolen,
  },
  isLocalPlayer,
}: RabbitControllerProps): JSX.Element => {
  const setPlayers = useSetAtom(playersAtom);
  const [animation, setAnimation] = useState<RabbitActionName>(
    'CharacterArmature|Idle',
  );
  const rb = useRef<RapierRigidBody>(null);
  const container = useRef<Group>(null);
  const character = useRef<Group>(null);
  // 위치 초기화
  const isInitialized = useRef(false);
  // 뺏는 액션 시간 제한
  const punchAnimationTimer = useRef<NodeJS.Timeout | null>(null);
  const isPunching = useRef(false);

  // 빼앗긴 액션 시간 제한
  const stolenAnimationTimer = useRef<NodeJS.Timeout | null>(null);
  const isCurrentlyStolen = useRef(false);

  const mouseControlRef = useRef<any>(null);
  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const rotationTargetY = useRef(0);
  const cameraTarget = useRef<Group>(null);
  const cameraPosition = useRef<Group>(null); // 그룹 내에서의 상대적 위치
  const cameraLookAtWorldPosition = useRef(new Vector3()); // cameraTarget의 절대 위치
  const cameraWorldPosition = useRef(new Vector3()); // cameraPosition의 절대 위치
  const cameraLookAt = useRef(new Vector3()); // 부드럽게 해당 위치로 회전하기 위한 Ref
  const currentExtraHeight = useRef(0);
  const currentExtraDistance = useRef(0);
  const currentCameraHeight = useRef(0);
  const currentForwardDistance = useRef(6);
  const { updateCamera } = useCamera({
    cameraTarget,
    cameraPosition,
    rotationTargetY,
    currentExtraHeight,
    currentExtraDistance,
    currentCameraHeight,
    currentForwardDistance,
    cameraWorldPosition,
    cameraLookAtWorldPosition,
    cameraLookAt,
  });

  // 다른 플레이어들의 부드러운 움직임을 위한 ref
  const currentPosition = useRef(position);
  const currentVelocity = useRef(velocity);
  const lastServerPosition = useRef(position);

  const getControls = useKeyControl();

  const { updateMovement } = useCharacterControl({
    rotationTarget,
    mouseControlRef,
    characterRotationTarget,
    isPunching,
    punchAnimationTimer,
    setAnimation,
    giftCnt,
    isBeingStolen,
    isCurrentlyStolen,
    stolenAnimationTimer,
    steal,
    lastServerPosition,
    currentPosition,
    character,
    container,
  });

  const { updateAnimation } = useCharacterAnimation({
    isBeingStolen,
    isCurrentlyStolen,
    stolenAnimationTimer,
    isPunching,
    punchAnimationTimer,
    steal,
    giftCnt,
    setAnimation,
  });

  const { updatePlayerState } = usePlayerState({ id, lastServerPosition });

  // Mouse Control 부분
  useMouseRotation({
    mouseControlRef,
    rotationTarget,
    rotationTargetY,
    velocity,
  });

  useFrame(({ camera }, delta) => {
    if (rb.current) {
      if (isLocalPlayer) {
        // 직선 운동 속도
        const pos = rb.current.translation();
        const isOnGround = Math.abs(rb.current.linvel().y) < 0.1;

        const controls = getControls();
        const { velocity: vel } = updateMovement(
          controls,
          rb.current,
          isOnGround,
        );
        updatePlayerState(pos, vel);
        updateCamera(camera, isOnGround);
      } else {
        if (rb.current) {
          // 거리 보정
          const distanceToTarget = Math.sqrt(
            Math.pow(currentPosition.current.x - position.x, 2) +
              Math.pow(currentPosition.current.z - position.z, 2),
          );
          if (distanceToTarget > import.meta.env.VITE_DISTANCE_THRESHOLD) {
            currentPosition.current = { ...position };
            currentVelocity.current = { ...velocity };
            rb.current.setTranslation(position, true);
            rb.current.setLinvel(velocity, true);
          } else {
            const predictPosition = {
              x: currentPosition.current.x + currentVelocity.current.x * delta,
              y: currentPosition.current.y + currentVelocity.current.y * delta,
              z: currentPosition.current.z + currentVelocity.current.z * delta,
            };

            currentPosition.current = {
              x: MathUtils.lerp(predictPosition.x, position.x, 0.1),
              y: MathUtils.lerp(predictPosition.y, position.y, 0.1),
              z: MathUtils.lerp(predictPosition.z, position.z, 0.1),
            };

            currentVelocity.current = {
              x: MathUtils.lerp(currentVelocity.current.x, velocity.x, 0.1),
              y: MathUtils.lerp(currentVelocity.current.y, velocity.y, 0.1),
              z: MathUtils.lerp(currentVelocity.current.z, velocity.z, 0.1),
            };

            // 서버에서 받은 위치로 업데이트
            rb.current.setTranslation(currentPosition.current, true);
            rb.current.setLinvel(currentVelocity.current, true);
          }

          // 애니메이션 설정
          updateAnimation(velocity);

          // 캐릭터 회전
          if (character.current && isMovingSignificantly(velocity)) {
            const targetAngle = Math.atan2(velocity.x, velocity.z);
            character.current.rotation.y = lerpAngle(
              character.current.rotation.y,
              targetAngle,
              0.1,
            );
          }
        }
      }
    }
  });

  // 초기 위치 설정
  useEffect(() => {
    if (!isInitialized.current && rb.current) {
      currentPosition.current = position;
      currentVelocity.current = velocity;
      rb.current.setTranslation(position, true);
      rb.current.setLinvel(velocity, true);
      isInitialized.current = true;
    }
  }, []);

  return (
    // 충돌 감지 비활성화: Capsule 쓰기 위해서, lockRotations: 안넘어지게
    <RigidBody colliders={false} lockRotations ref={rb}>
      {isLocalPlayer && <PointerLockControls ref={mouseControlRef} />}
      <group ref={container}>
        {isLocalPlayer && (
          <>
            <group ref={cameraTarget} position-z={6} />
            <group ref={cameraPosition} position-y={10} position-z={-15} />
          </>
        )}
        <group ref={character}>
          <AnimatedRabbit
            nickName={nickName}
            animation={animation}
            charColor={charColor}
          />
          {Array.from({ length: giftCnt }).map((_, index) => (
            <Present index={index} key={id + index} />
          ))}
        </group>
      </group>
      <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.3, 0]} />
    </RigidBody>
  );
};

export default RabbitController;
