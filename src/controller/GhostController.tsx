import { CapsuleCollider, RigidBody } from '@react-three/rapier';
import { useState } from 'react';
import { PointerLockControls } from '@react-three/drei';
import { Character } from '../types/player';
import { Present } from '../components/present';
import useKeyControl from '../hooks/useKeyControl';
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
import { AnimatedGhost, GhostActionName } from '../hooks/AnimatedGhost';

interface GhostControllerProps {
  player: Character;
  isLocalPlayer?: boolean;
}

const GhostController = ({
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
}: GhostControllerProps): JSX.Element => {
  const [animation, setAnimation] = useState<GhostActionName>(
    'CharacterArmature|Flying_Idle',
  );

  const {
    rb,
    container,
    character,
    currentPosition,
    currentVelocity,
    lastServerPosition,
  } = useCharacterRefs(position, velocity);

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

  const getControls = useKeyControl();

  const { updateMovement } = useCharacterControl({
    charType: 3,
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
    lastServerPosition,
    currentPosition,
    character,
    container,
    eventBlock,
    isSkillActive,
    totalSkillCooldown,
    currentSkillCooldown,
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
    lastServerPosition,
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
    getControls,
    updateMovement,
    updatePlayerState,
    updateCamera,
    updateRemotePosition,
    updateAnimation,
    velocity,
  });

  return (
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
          <AnimatedGhost
            nickName={nickName}
            animation={animation}
            charColor={charColor}
            isTransparent={isSkillActive}
            isLocalPlayer={isLocalPlayer}
          />
          {Array.from({ length: giftCnt }).map((_, index) => (
            <Present
              index={index}
              key={id + index}
              isTransparent={isSkillActive}
              isLocalPlayer={isLocalPlayer}
            />
          ))}
        </group>
      </group>
      <ProtectEffect duration={protectMotion} radius={2.2} />
      <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.3, 0]} />
    </RigidBody>
  );
};

export default GhostController;
