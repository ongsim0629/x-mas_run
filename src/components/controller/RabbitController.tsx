import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatedRabbit, RabbitActionName } from '../models/AnimatedRabbit';
import { useControls } from 'leva';
import { degToRad, MathUtils } from 'three/src/math/MathUtils.js';
import { Group, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { PointerLockControls, useKeyboardControls } from '@react-three/drei';
import { Tail } from '../models/Tail';
import TailEffect from '../effect/TailEffect';
import { Character } from '../../types/player';
import { useAtom, useSetAtom } from 'jotai';
import { playersAtom } from '../../atoms/PlayerAtoms';

interface RabbitControllerProps {
  player: Character;
  isLocalPlayer?: boolean;
}

const RabbitController = ({
  player: { id, hasTail, position, velocity },
  isLocalPlayer,
}: RabbitControllerProps): JSX.Element => {
  const { SPEED, ROTATION_SPEED, MOUSE_SPEED } = useControls(
    '스피드 컨트롤러🐰',
    {
      SPEED: { value: 4, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: {
        value: degToRad(0.5),
        min: degToRad(0.1),
        max: degToRad(5),
        step: degToRad(0.1),
      },
      MOUSE_SPEED: {
        value: 0.002,
        min: 0.001,
        max: 0.01,
        step: 0.001,
      },
    },
  );
  const setPlayers = useSetAtom(playersAtom);
  const [animation, setAnimation] = useState<RabbitActionName>(
    'CharacterArmature|Idle',
  );
  const rb = useRef<RapierRigidBody>();
  const container = useRef<Group>();
  const character = useRef<Group>();

  const mouseControlRef = useRef<any>();
  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef<Group>();
  const cameraPosition = useRef<Group>(); // 그룹 내에서의 상대적 위치
  const cameraLookAtWorldPosition = useRef(new Vector3()); // cameraTarget의 절대 위치
  const cameraWorldPosition = useRef(new Vector3()); // cameraPosition의 절대 위치
  const cameraLookAt = useRef(new Vector3()); // 부드럽게 해당 위치로 회전하기 위한 Ref

  const [, get] = useKeyboardControls();

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
      if (mouseControlRef.current?.isLocked)
        rotationTarget.current -= event.movementX * MOUSE_SPEED;
    };
    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [MOUSE_SPEED]);

  // Keyboard Control 부분
  const normalizeAngle = useCallback((angle: any) => {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
  }, []);
  const lerpAngle = useCallback((start: any, end: any, t: any) => {
    start = normalizeAngle(start);
    end = normalizeAngle(end);

    if (Math.abs(end - start) > Math.PI) {
      if (end > start) start += 2 * Math.PI;
      else end += 2 * Math.PI;
    }
    return normalizeAngle(start + (end - start) * t);
  }, []);

  useFrame(({ camera }) => {
    if (isLocalPlayer) {
      if (rb.current) {
        // 직선 운동 속도
        const vel = rb.current.linvel();
        const pos = rb.current.translation();

        const movement = {
          x: 0,
          y: 0,
          z: 0,
        };

        if (get().forward) movement.z = 1;
        if (get().backward) movement.z = -1;
        if (get().left) movement.x = 1;
        if (get().right) movement.x = -1;
        if (get().jump) movement.y = 1;

        if (movement.x !== 0 && !mouseControlRef.current?.isLocked) {
          // 전체 회전
          rotationTarget.current += ROTATION_SPEED * movement.x;
        }

        if (movement.x !== 0 || movement.z !== 0) {
          // 각도를 구해서 캐릭터 회전을 더함
          characterRotationTarget.current = Math.atan2(movement.x, movement.z);
          vel.x =
            Math.sin(rotationTarget.current + characterRotationTarget.current) *
            SPEED;
          vel.z =
            Math.cos(rotationTarget.current + characterRotationTarget.current) *
            SPEED;
          setAnimation('CharacterArmature|Run');
        } else {
          setAnimation('CharacterArmature|Idle');
        }

        rb.current.setLinvel(vel, true);

        setPlayers((prev) =>
          prev.map((player) =>
            player.id === id
              ? {
                  ...player,
                  position,
                  velocity,
                  isOnGround: Math.abs(vel.y) < 0.1,
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

      // Vector3 실행을 반복하지 않기 위해 나눠서 진행
      cameraPosition.current?.getWorldPosition(cameraWorldPosition.current);
      camera.position.lerp(cameraWorldPosition.current, 0.1);

      cameraTarget.current?.getWorldPosition(cameraLookAtWorldPosition.current);
      // 부드러운 회전을 위한 중간값 지정
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
      camera.lookAt(cameraLookAt.current);
    } else {
      if (rb.current) {
        // 서버에서 받은 위치로 업데이트
        rb.current.setTranslation(position, true);
        rb.current.setLinvel(velocity, true);

        // 애니메이션 설정
        const isMoving =
          Math.abs(velocity.x) > 0.1 || Math.abs(velocity.z) > 0.1;
        setAnimation(
          isMoving ? 'CharacterArmature|Run' : 'CharacterArmature|Idle',
        );

        // 캐릭터 회전
        if (character.current && isMoving) {
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

  return (
    // 충돌 감지 비활성화: Capsule 쓰기 위해서, lockRotations: 안넘어지게
    <RigidBody colliders={false} lockRotations ref={rb}>
      {isLocalPlayer && <PointerLockControls ref={mouseControlRef} />}
      <group ref={container}>
        {isLocalPlayer && (
          <>
            <group ref={cameraTarget} position-z={1.5} />
            <group ref={cameraPosition} position-y={7} position-z={-15} />
          </>
        )}
        <group ref={character}>
          <AnimatedRabbit
            animation={animation}
            bodyColor={'gold'}
            bellyColor={'white'}
            hairColor={'black'}
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
