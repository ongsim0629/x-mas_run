import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
} from 'react';
import { Position } from '../types/player';
import { useAtom, useSetAtom } from 'jotai';
import { playAudioAtom } from '../atoms/GameAtoms';
import { animationRefsAtom } from '../atoms/PlayerAtoms';

type CharType = 1 | 2 | 3;

type AnimationConfig = {
  charType: CharType;
  stolenMotion: boolean;
  isCurrentlyStolen: MutableRefObject<boolean>;
  stolenAnimationTimer: MutableRefObject<NodeJS.Timeout | null>;
  isPunching: MutableRefObject<boolean>;
  punchAnimationTimer: MutableRefObject<NodeJS.Timeout | null>;
  stealMotion: boolean;
  giftCnt: number;
  setAnimation: Dispatch<SetStateAction<any>>;
};

const animationTable = {
  1: {
    idle: 'CharacterArmature|Idle',
    idleWithGift: 'CharacterArmature|Idle_Gun',
    run: 'CharacterArmature|Run',
    runWithGift: 'CharacterArmature|Run_Gun',
    walkWithGift: 'CharacterArmature|Walk_Gun',
    jump: 'CharacterArmature|Jump_Idle',
    punch: 'CharacterArmature|Punch',
    duck: 'CharacterArmature|Duck',
  },
  2: {
    idle: 'Armature|Idle',
    idleWithGift: 'Armature|Idle_Gun',
    run: 'Armature|Run',
    runWithGift: 'Armature|Run_Gun',
    walkWithGift: 'Armature|Walk_Gun',
    jump: 'Armature|Jump_Idle',
    punch: 'Armature|Punch_Object_5',
    duck: 'Armature|Duck',
  },
  3: {
    idle: 'CharacterArmature|Flying_Idle',
    idleWithGift: 'CharacterArmature|Flying_Idle',
    run: 'CharacterArmature|Fast_Flying',
    runWithGift: 'CharacterArmature|Fast_Flying',
    walkWithGift: 'CharacterArmature|Flying_Idle',
    jump: 'CharacterArmature|Flying_Idle',
    punch: 'CharacterArmature|Punch',
    duck: 'CharacterArmature|HitReact',
  },
} as const;

const useCharacterAnimation = ({
  charType,
  stolenMotion,
  isCurrentlyStolen,
  stolenAnimationTimer,
  isPunching,
  punchAnimationTimer,
  stealMotion,
  giftCnt,
  setAnimation,
}: AnimationConfig) => {
  const setAnimationRefs = useSetAtom(animationRefsAtom);
  const [, playAudio] = useAtom(playAudioAtom);

  const playJumpAnimation = useCallback(() => {
    playAudio('jump');
    setAnimation(animationTable[charType].jump);
  }, []);

  const playPunchAnimation = useCallback(() => {
    playAudio('punch');
    isPunching.current = true;
    setAnimation(animationTable[charType].punch);
    const now = Date.now();
    setAnimationRefs((prev) => ({
      ...prev,
      isPunching: true,
      lastPunchTime: now,
    }));

    if (punchAnimationTimer.current) {
      clearTimeout(punchAnimationTimer.current);
    }

    punchAnimationTimer.current = setTimeout(() => {
      isPunching.current = false;
      setAnimationRefs((prev) => ({
        ...prev,
        isPunching: false,
      }));
    }, 500);
  }, []);

  const updateAnimation = useCallback(
    (vel: Position) => {
      if (stolenMotion && !isCurrentlyStolen.current) {
        isCurrentlyStolen.current = true;
        setAnimation(animationTable[charType].duck);
        playAudio('stolen');
        if (stolenAnimationTimer.current) {
          clearTimeout(stolenAnimationTimer.current);
        }
        stolenAnimationTimer.current = setTimeout(() => {
          isCurrentlyStolen.current = false;
        }, 500);
        return;
      }

      if (isCurrentlyStolen.current) return;

      if (stealMotion) {
        setAnimation(animationTable[charType].punch);
        return;
      }

      // 점프/공중 상태 체크
      if (vel.y > 0.1) {
        setAnimation(animationTable[charType].jump);
        return;
      }

      const velocityMagnitude = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
      const isMoving = velocityMagnitude > 0.5;
      const hasGift = giftCnt > 0;
      const hasLotsOfGifts = giftCnt >= 3;

      if (!isMoving) {
        setAnimation(
          hasGift
            ? animationTable[charType].idleWithGift
            : animationTable[charType].idle,
        );
        return;
      }

      // 선물 3개 이상일 때는 걷기 애니메이션
      if (hasLotsOfGifts) {
        setAnimation(animationTable[charType].walkWithGift);
        return;
      }

      // 기본 달리기 애니메이션
      setAnimation(
        hasGift
          ? animationTable[charType].runWithGift
          : animationTable[charType].run,
      );
    },
    [charType, stolenMotion, stealMotion, giftCnt],
  );

  useEffect(() => {
    return () => {
      if (stolenAnimationTimer.current) {
        clearTimeout(stolenAnimationTimer.current);
      }
      if (punchAnimationTimer.current) {
        clearTimeout(punchAnimationTimer.current);
      }
    };
  }, []);

  return { updateAnimation, playJumpAnimation, playPunchAnimation };
};
export default useCharacterAnimation;
