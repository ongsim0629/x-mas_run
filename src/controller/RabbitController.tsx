import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatedRabbit, RabbitActionName } from '../models/AnimatedRabbit';
import { degToRad, MathUtils } from 'three/src/math/MathUtils.js';
import { Group, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Character, Position } from '../types/player';
import { useAtom, useSetAtom } from 'jotai';
import { playersAtom } from '../atoms/PlayerAtoms';
import { isMovingSignificantly, lerpAngle } from '../utils/movementCalc';
import { playAudioAtom } from '../atoms/GameAtoms';
import { Present } from '../components/present';
import useKeyControl from '../hooks/useKeyControl';
import useCharacterControl from '../hooks/useCharacterControl';
import useCharacterAnimation from '../hooks/useCharacterAnimation';

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

  const { updateAnimation, playJumpAnimation, playPunchAnimation } =
    useCharacterAnimation({
      isBeingStolen,
      isCurrentlyStolen,
      stolenAnimationTimer,
      isPunching,
      punchAnimationTimer,
      steal,
      giftCnt,
      setAnimation,
    });

  // Mouse Control 부분
  useEffect(() => {
    const handlePointerLockChange = () => {
      if (document.pointerLockElement) {
      } else {
        rotationTargetY.current = 0;
      }
    };

    const handleClick = () => {
      if (mouseControlRef.current && !mouseControlRef.current.isLocked)
        mouseControlRef.current.lock();
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener(
        'pointerlockchange',
        handlePointerLockChange,
      );
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (mouseControlRef.current?.isLocked) {
        // x축 회전
        rotationTarget.current -=
          event.movementX * import.meta.env.VITE_INGAME_MOUSE_SPEED;
        const isOnGround = Math.abs(velocity.y) < 0.1;
        const minY = isOnGround ? -0.5 : -1;
        // y축 회전 (최대, 최소 제한) +  공중이면 엉덩이 볼 수 있게
        rotationTargetY.current = MathUtils.clamp(
          rotationTargetY.current -
            event.movementY * import.meta.env.VITE_INGAME_MOUSE_SPEED,
          minY,
          0.5,
        );
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [import.meta.env.VITE_INGAME_MOUSE_SPEED, velocity.y]);

  useFrame(({ camera }, delta) => {
    if (isLocalPlayer) {
      if (rb.current) {
        // 직선 운동 속도
        const pos = rb.current.translation();
        const isOnGround = Math.abs(rb.current.linvel().y) < 0.1;

        const controls = getControls();
        const { velocity: newVel } = updateMovement(
          controls,
          rb.current,
          isOnGround,
        );

        setPlayers((prev) =>
          prev.map((player) =>
            player.id === id
              ? {
                  ...player,
                  position: {
                    x: pos.x,
                    y: pos.y,
                    z: pos.z,
                  },
                  velocity: newVel,
                  isOnGround,
                }
              : player,
          ),
        );
        // 서버로 보낼 위치를 lastServerPosition으로 저장
        lastServerPosition.current = {
          x: pos.x,
          y: pos.y,
          z: pos.z,
        };
      }

      if (cameraPosition.current && cameraTarget.current) {
        const isOnGround = Math.abs(velocity.y || 0) < 0.1;
        // 카메라 수직 회전 적용
        const verticalOffset = Math.sin(rotationTargetY.current) * 15;
        const horizontalDistance = Math.cos(rotationTargetY.current) * 15;

        // 현재 상태에 따른 목표 값 계산
        const targetExtraHeight =
          !isOnGround && rotationTargetY.current < -0.2 ? 0 : 0;
        const targetExtraDistance =
          !isOnGround && rotationTargetY.current < -0.2 ? 10 : 0;
        const targetCameraHeight =
          !isOnGround && rotationTargetY.current < -0.2 ? 15 : 0;
        const targetForwardDistance =
          !isOnGround && rotationTargetY.current < -0.2 ? 10 : 6;

        currentExtraHeight.current = MathUtils.lerp(
          currentExtraHeight.current,
          targetExtraHeight,
          0.05,
        );

        currentExtraDistance.current = MathUtils.lerp(
          currentExtraDistance.current,
          targetExtraDistance,
          0.05,
        );

        currentCameraHeight.current = MathUtils.lerp(
          currentCameraHeight.current,
          targetCameraHeight,
          0.05,
        );

        currentForwardDistance.current = MathUtils.lerp(
          currentForwardDistance.current,
          targetForwardDistance,
          0.05,
        );

        cameraPosition.current.position.set(
          0,
          10 + verticalOffset + currentExtraHeight.current,
          -(horizontalDistance + currentExtraDistance.current),
        );

        cameraTarget.current.position.set(
          0,
          currentCameraHeight.current,
          currentForwardDistance.current,
        );
      }

      // Vector3 실행을 반복하지 않기 위해 나눠서 진행
      cameraPosition.current?.getWorldPosition(cameraWorldPosition.current);
      camera.position.lerp(cameraWorldPosition.current, 0.1);

      cameraTarget.current?.getWorldPosition(cameraLookAtWorldPosition.current);
      // 부드러운 회전을 위한 중간값 지정
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
      camera.lookAt(cameraLookAt.current);
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
  useEffect(() => {
    return () => {
      if (punchAnimationTimer.current) {
        clearTimeout(punchAnimationTimer.current);
      }
      if (stolenAnimationTimer.current) {
        clearTimeout(stolenAnimationTimer.current);
      }
    };
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
      {/* args: [halfHeight, radius], rabbit 사이즈만큼 position으로 끌어올려야함 */}
      <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.3, 0]} />
    </RigidBody>
  );
};

export default RabbitController;
