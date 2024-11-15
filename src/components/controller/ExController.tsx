import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatedRabbit, RabbitActionName } from "../models/AnimatedRabbit";
import { useControls } from "leva";
import { MathUtils } from "three/src/math/MathUtils.js";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { Character } from "../../types/player";
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { PointerLockControls } from "@react-three/drei";

type RabbitControllerProps = {
  player: Character;
};
const ExController = ({
  player: { position, velocity, facingAngleRad = 0 },
}: RabbitControllerProps) => {
  const { MOUSE_SPEED } = useControls("스피드 컨트롤러🐰", {
    MOUSE_SPEED: {
      value: 0.002,
      min: 0.001,
      max: 0.01,
      step: 0.001,
    },
  });

  const rb = useRef<RapierRigidBody>();
  const container = useRef<Group>();
  const character = useRef<Group>();
  const cameraTarget = useRef<Group>();
  const cameraPosition = useRef<Group>(); // 그룹 내에서의 상대적 위치
  const mouseControlRef = useRef<any>();

  // 현재 위치/회전
  const rotationTarget = useRef(0);
  const currentPosition = useRef(new Vector3());
  const targetPosition = useRef(new Vector3());

  const cameraLookAtWorldPosition = useRef(new Vector3()); // cameraTarget의 절대 위치
  const cameraWorldPosition = useRef(new Vector3()); // cameraPosition의 절대 위치
  const cameraLookAt = useRef(new Vector3()); // 부드럽게 해당 위치로 회전하기 위한 Ref

  const [animation, setAnimation] = useState<RabbitActionName>(
    "CharacterArmature|Idle",
  );

  const normalizeAngle = useCallback((angle: number) => {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
  }, []);

  const lerpAngle = useCallback((start: number, end: number, t: number) => {
    start = normalizeAngle(start);
    end = normalizeAngle(end);

    if (Math.abs(end - start) > Math.PI) {
      if (end > start) start += 2 * Math.PI;
      else end += 2 * Math.PI;
    }
    return normalizeAngle(start + (end - start) * t);
  }, []);

  // Mouse Control 부분
  useEffect(() => {
    const handleClick = () => {
      if (mouseControlRef.current && !mouseControlRef.current.isLocked)
        mouseControlRef.current.lock();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (mouseControlRef.current?.isLocked)
        rotationTarget.current -= event.movementX * MOUSE_SPEED;
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [MOUSE_SPEED]);

  // 초기 위치 설정
  useEffect(() => {
    if (container.current) {
      currentPosition.current.set(position.x, position.y, position.z);
      container.current.position.set(position.x, position.y, position.z);
    }
  }, []);

  useEffect(() => {
    const isMoving = velocity.x || velocity.z ? true : false;
    const isJumping =
      Math.abs(velocity.y) > import.meta.env.VITE_JUMP_VELOCITY_THRESHOLD;
    if (isJumping) setAnimation("CharacterArmature|Jump");
    else if (isMoving) setAnimation("CharacterArmature|Run");
    else setAnimation("CharacterArmature|Idle");

    targetPosition.current.set(position.x, position.y, position.z);
  }, [position, velocity]);

  useFrame(({ camera }, delta) => {
    if (!container.current || !character.current || !rb.current) return;

    const vel = rb.current.linvel();

    if (velocity.x) {
      // 전체 회전
      rotationTarget.current += 0.01 * velocity.x;
    }

    // 캐릭터 이동 방향 회전
    if (velocity.x || velocity.z) {
      vel.x = Math.sin(facingAngleRad);
      vel.z = Math.cos(facingAngleRad);
      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        facingAngleRad,
        import.meta.env.VITE_ROTATION_LERP_FACTOR,
      );
    }
    // console.log(position, velocity);

    rb.current.setLinvel(vel, true);

    currentPosition.current.lerp(
      targetPosition.current,
      import.meta.env.VITE_POSITION_LERP_FACTOR,
    );
    container.current.position.copy(currentPosition.current);

    container.current.rotation.y = MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      import.meta.env.VITE_ROTATION_LERP_FACTOR,
    );

    // Vector3 실행을 반복하지 않기 위해 나눠서 진행
    cameraPosition.current?.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);

    cameraTarget.current?.getWorldPosition(cameraLookAtWorldPosition.current);
    // 부드러운 회전을 위한 중간값 지정
    cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
    camera.lookAt(cameraLookAt.current);
  });

  return (
    <RigidBody colliders={false} lockRotations ref={rb}>
      <PointerLockControls ref={mouseControlRef} />
      {/* 캐릭터를 감싸는 그룹 ref */}
      <group ref={container}>
        {/* 실제 카메라가 보는 부분 ref */}
        <group ref={cameraTarget} position-z={1.5} />
        {/* 카메라가 위치할 부분 ref */}
        <group ref={cameraPosition} position-y={7} position-z={-15} />
        <group ref={character}>
          <AnimatedRabbit
            animation={animation}
            bodyColor={"gold"}
            bellyColor={"white"}
            hairColor={"black"}
          />
        </group>
      </group>
      {/* args: [halfHeight, radius], rabbit 사이즈만큼 position으로 끌어올려야함 */}
      <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.3, 0]} />
    </RigidBody>
  );
};

export default ExController;
