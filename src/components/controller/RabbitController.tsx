import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatedRabbit, RabbitActionName } from '../models/AnimatedRabbit';
import { useControls } from 'leva';
import { degToRad, MathUtils } from 'three/src/math/MathUtils.js';
import { Group, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { PointerLockControls, useKeyboardControls } from '@react-three/drei';
import { Tail } from '../models/Tail';
import TailEffect from '../effect/TailEffect';
import { Character, Position } from '../../types/player';
import { useAtom, useSetAtom } from 'jotai';
import { playersAtom } from '../../atoms/PlayerAtoms';
import { isMovingSignificantly, lerpAngle } from '../../utils/movementCalc';
import useAudio from '../../hooks/useAudio';
import { playAudioAtom } from '../../atoms/GameAtoms';

interface RabbitControllerProps {
  player: Character;
  isLocalPlayer?: boolean;
}

const RabbitController = ({
  player: {
    id,
    hasTail,
    position,
    velocity,
    nickName,
    bellyColor,
    hairColor,
    bodyColor,
  },
  isLocalPlayer,
}: RabbitControllerProps): JSX.Element => {
  const { SPEED, ROTATION_SPEED, MOUSE_SPEED, JUMP_FORCE, GRAVITY } =
    useControls('스피드 컨트롤러🐰', {
      SPEED: { value: 6, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: {
        value: degToRad(0.5),
        min: degToRad(0.1),
        max: degToRad(5),
        step: degToRad(0.1),
      },
      MOUSE_SPEED: {
        value: 0.003,
        min: 0.001,
        max: 0.01,
        step: 0.001,
      },
      JUMP_FORCE: { value: 5, min: 1, max: 10, step: 0.1 },
      GRAVITY: { value: -9.81, min: -20, max: -1, step: 0.1 },
    });
  const setPlayers = useSetAtom(playersAtom);
  const [animation, setAnimation] = useState<RabbitActionName>(
    'CharacterArmature|Idle',
  );
  const [, playAudio] = useAtom(playAudioAtom);
  const rb = useRef<RapierRigidBody>(null);
  const container = useRef<Group>(null);
  const character = useRef<Group>(null);
  // 위치 초기화
  const isInitialized = useRef(false);
  // 뺏는 액션 시간 제한
  const punchAnimationTimer = useRef<NodeJS.Timeout | null>(null);
  const isPunching = useRef(false);

  const mouseControlRef = useRef<any>(null);
  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const rotationTargetY = useRef(0);
  const cameraTarget = useRef<Group>(null);
  const cameraPosition = useRef<Group>(null); // 그룹 내에서의 상대적 위치
  const cameraLookAtWorldPosition = useRef(new Vector3()); // cameraTarget의 절대 위치
  const cameraWorldPosition = useRef(new Vector3()); // cameraPosition의 절대 위치
  const cameraLookAt = useRef(new Vector3()); // 부드럽게 해당 위치로 회전하기 위한 Ref

  // 다른 플레이어들의 부드러운 움직임을 위한 ref
  const currentPosition = useRef(position);
  const currentVelocity = useRef(velocity);

  const [, get] = useKeyboardControls();

  const updateAnimation = useCallback(
    (vel: Position, isOnGround: boolean) => {
      if (!isOnGround) return;
      const velocityMagnitude = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
      const isMoving = velocityMagnitude > 0.5;
      if (
        (isMoving && animation === 'CharacterArmature|Run') ||
        (!isMoving && animation === 'CharacterArmature|Idle')
      )
        return;
      setAnimation(
        isMoving ? 'CharacterArmature|Run' : 'CharacterArmature|Idle',
      );
    },
    [animation],
  );

  // Mouse Control 부분
  useEffect(() => {
    const handleClick = () => {
      if (mouseControlRef.current && !mouseControlRef.current.isLocked)
        mouseControlRef.current.lock();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (mouseControlRef.current?.isLocked) {
        // x축 회전
        rotationTarget.current -= event.movementX * MOUSE_SPEED;
        // y축 회전 (최대, 최소 제한)
        rotationTargetY.current = MathUtils.clamp(
          rotationTargetY.current - event.movementY * MOUSE_SPEED,
          -0.5,
          0.3,
        );
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [MOUSE_SPEED]);

  useFrame(({ camera }, delta) => {
    if (isLocalPlayer) {
      if (rb.current) {
        // 직선 운동 속도
        const vel = rb.current.linvel();
        const pos = rb.current.translation();

        const isOnGround = Math.abs(vel.y) < 0.1;

        const movement = {
          x: 0,
          y: 0,
          z: 0,
        };

        if (get().forward) movement.z = 1;
        if (get().backward) movement.z = -1;
        if (get().left) movement.x = 1;
        if (get().right) movement.x = -1;

        if (get().jump) {
          playAudio('jump');

          if (character.current) {
            const position = character.current.getWorldPosition(new Vector3());

            if (position.y >= 30) {
              vel.y += GRAVITY * 0.016 * 1.25;
            } else {
              vel.y = JUMP_FORCE;
            }
            setAnimation('CharacterArmature|Jump');
          }
        } else if (!isOnGround) {
          vel.y += GRAVITY * 0.016 * 1.25; // 0.016은 60fps 시간
        }

        if (movement.x !== 0 && !mouseControlRef.current?.isLocked) {
          // 전체 회전
          rotationTarget.current += ROTATION_SPEED * movement.x;
        }

        if (movement.x !== 0 || movement.z !== 0 || movement.y !== 0) {
          // 각도를 구해서 캐릭터 회전을 더함
          characterRotationTarget.current = Math.atan2(movement.x, movement.z);
          vel.x =
            Math.sin(rotationTarget.current + characterRotationTarget.current) *
            SPEED;
          vel.z =
            Math.cos(rotationTarget.current + characterRotationTarget.current) *
            SPEED;
        }

        if (get().catch && !isPunching.current) {
          playAudio('punch');
          isPunching.current = true;
          setAnimation('CharacterArmature|Punch');
          punchAnimationTimer.current = setTimeout(
            () => (isPunching.current = false),
            500,
          );
        } else if (!isPunching.current && isOnGround) {
          if (movement.x !== 0 || movement.z !== 0)
            setAnimation('CharacterArmature|Run');
          else setAnimation('CharacterArmature|Idle');
        }

        rb.current.setLinvel(vel, true);

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
                  velocity: {
                    x: vel.x,
                    y: vel.y,
                    z: vel.z,
                  },
                  isOnGround,
                }
              : player,
          ),
        );

        if (character.current) {
          character.current.rotation.y = lerpAngle(
            character.current.rotation.y,
            characterRotationTarget.current,
            0.1,
          );
        }
      }
      if (container.current) {
        container.current.rotation.y = MathUtils.lerp(
          container.current.rotation.y,
          rotationTarget.current,
          0.1,
        );
      }

      if (cameraPosition.current && cameraTarget.current) {
        // 카메라 수직 회전 적용
        const verticalOffset = Math.sin(rotationTargetY.current) * 15;
        const horizontalDistance = Math.cos(rotationTargetY.current) * 15;

        cameraPosition.current.position.set(
          0,
          10 + verticalOffset,
          -horizontalDistance,
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
        updateAnimation(velocity, Math.abs(velocity.y) < 0.1);

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
            // scale={0.18}
            nickName={nickName}
            animation={animation}
            bodyColor={bodyColor}
            bellyColor={bellyColor}
            hairColor={hairColor}
          />
          {hasTail && (
            <group position={[0, 0.3, -0.2]}>
              <Tail scale={[3, 3, 3]} />
              <TailEffect />
            </group>
          )}
        </group>
      </group>
      {/* args: [halfHeight, radius], rabbit 사이즈만큼 position으로 끌어올려야함 */}
      <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.3, 0]} />
    </RigidBody>
  );
};

export default RabbitController;
