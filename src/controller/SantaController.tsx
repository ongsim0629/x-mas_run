import { CapsuleCollider, RigidBody } from '@react-three/rapier';
import { useState, useCallback, useMemo } from 'react';
import { AnimatedSanta, SantaActionName } from '../models/AnimatedSanta';
import { PointerLockControls } from '@react-three/drei';
import { Character } from '../types/player';
import { Present } from '../components/present';
import useCharacterControl from '../hooks/useCharacterControl';
import useCharacterAnimation from '../hooks/useCharacterAnimation';
import useCamera from '../hooks/useCamera';
import usePlayerState from '../hooks/usePlayerState';
import useMouseRotation from '../hooks/useMouseRotation';
import usePlayersInterpolation from '../hooks/usePlayersInterpolation';
import useCharacterRefs from '../hooks/refs/useCharacterRefs';
import useCameraRefs from '../hooks/refs/useCameraRefs';
import useAnimationRefs from '../hooks/refs/useAnmiationRefs';
import useGameLoop from '../hooks/useGameLoop';
import useMouseRefs from '../hooks/refs/useMouseRefs';
import ProtectEffect from '../components/effect/ProtectEffect';
import { Model as Sleigh } from '../models/Sleigh';
import CircleShadow from '../components/UI/Shadow';

interface SantaControllerProps {
  player: Character;
  isLocalPlayer?: boolean;
}

const SantaController = ({
  player: {
    id,
    giftCnt,
    position,
    velocity,
    nickName,
    charType,
    charColor,
    stealMotion,
    stolenMotion,
    protectMotion,
    eventBlock,
    isSkillActive,
    totalSkillCooldown,
    currentSkillCooldown,
  },
  isLocalPlayer,
}: SantaControllerProps): JSX.Element => {
  const [animation, setAnimation] = useState<SantaActionName>(
    'Armature|happy Idle',
  );

  const { rb, container, character, currentPosition, currentVelocity } =
    useCharacterRefs(position, velocity);

  // 썰매 위치 계산
  const getSleighPosition = useCallback((): [number, number, number] => {
    if (!rb.current || !container.current) return [0, 0, 0];

    const playerPosition = rb.current.translation();
    if (!playerPosition) return [0, 0, 0];

    return [
      playerPosition.x,
      playerPosition.y - 1, // 캐릭터보다 약간 아래에 위치
      playerPosition.z,
    ];
  }, [rb, container]);

  const sleighPosition = useMemo((): [number, number, number] => {
    if (!isSkillActive) return [0, 0, 0];
    return getSleighPosition();
  }, [isSkillActive, getSleighPosition]);

  const {
    mouseControlRef,
    rotationTarget,
    rotationTargetY,
    characterRotationTarget,
  } = useMouseRefs();

  const {
    cameraTarget,
    cameraPosition,
    cameraLookAtWorldPosition,
    cameraWorldPosition,
    cameraLookAt,
    currentExtraHeight,
    currentExtraDistance,
    currentCameraHeight,
    currentForwardDistance,
  } = useCameraRefs();

  const {
    punchAnimationTimer,
    isPunching,
    stolenAnimationTimer,
    isCurrentlyStolen,
  } = useAnimationRefs();

  const { updateMovement } = useCharacterControl({
    charType: 2,
    rotationTarget,
    mouseControlRef,
    characterRotationTarget,
    isPunching,
    punchAnimationTimer,
    setAnimation,
    giftCnt,
    stolenMotion,
    isCurrentlyStolen,
    stolenAnimationTimer,
    stealMotion,
    position,
    character,
    container,
    eventBlock,
    isSkillActive,
    totalSkillCooldown,
    currentSkillCooldown,
    // 썰매 탑승 시 이동속도 증가
    speedMultiplier: isSkillActive ? 20 / import.meta.env.VITE_INGAME_SPEED : 1,
  });

  const { updateAnimation } = useCharacterAnimation({
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

  const { updatePlayerState } = usePlayerState({
    id,
  });

  const { updateRemotePosition } = usePlayersInterpolation({
    currentPosition,
    currentVelocity,
    position,
    velocity,
    rb,
    character,
  });

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

  useMouseRotation({
    mouseControlRef,
    rotationTarget,
    rotationTargetY,
    velocity,
  });

  useGameLoop({
    isLocalPlayer,
    rb,
    updateMovement,
    updatePlayerState,
    updateCamera,
    updateRemotePosition,
    updateAnimation,
    velocity,
  });

  return (
    <>
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
            <AnimatedSanta
              nickName={nickName}
              animation={animation}
              charColor={charColor}
            />
            {Array.from({ length: giftCnt }).map((_, index) => (
              <Present index={index} key={id + index} />
            ))}
          </group>
        </group>
        <ProtectEffect duration={protectMotion} radius={2.2} />
        <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.3, 0]} />
      </RigidBody>
      <CircleShadow target={character} />
      {isSkillActive && (
        <RigidBody type="fixed" position={sleighPosition}>
          <Sleigh
            scale={[2, 2, 2]}
            rotation-y={container.current?.rotation.y ?? 0}
          />
        </RigidBody>
      )}
    </>
  );
};

export default SantaController;
