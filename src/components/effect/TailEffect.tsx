import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface EffectConfig {
  COUNT: number;
  RADIUS: number;
  COLOR?: string;
  TEXTURE: string;
  SCALE: {
    START: number;
    END: number;
  };
  DURATION: {
    MIN: number;
    MAX: number;
  };
}

interface CreateSpriteProps {
  texture: THREE.Texture;
  opacity?: number;
  color?: string;
  blending?: THREE.Blending;
  fog?: boolean;
}

interface AnimateSpriteProps {
  sprite: THREE.Sprite;
  position: {
    x: number;
    y: number;
    z: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
  duration: number;
  onComplete: () => void;
}

const EFFECTS: {
  CLOUD: EffectConfig;
  SPARKLE: EffectConfig;
} = {
  CLOUD: {
    COUNT: 70,
    RADIUS: 1,
    COLOR: '#d468ff',
    TEXTURE: '/effects/cloud.webp',
    SCALE: { START: 1.5, END: 1 },
    DURATION: { MIN: 1.5, MAX: 2.5 },
  },
  SPARKLE: {
    COUNT: 20,
    RADIUS: 1.2,
    TEXTURE: '/effects/sparkle.webp',
    SCALE: { START: 0.5, END: 0.2 },
    DURATION: { MIN: 1, MAX: 3 },
  },
};

// 단일 파티클 생성 함수
const createSprite = ({
  texture,
  opacity = 1,
  color,
  blending = THREE.NormalBlending,
  fog = true,
}: CreateSpriteProps): THREE.Sprite => {
  const material = new THREE.SpriteMaterial({
    map: texture,
    opacity,
    color: color ? new THREE.Color(color) : undefined,
    blending,
    fog,
  });
  return new THREE.Sprite(material);
};

const animateSprite = ({
  sprite,
  position,
  scale,
  duration,
  onComplete,
}: AnimateSpriteProps): void => {
  // 위치
  gsap.to(sprite.position, {
    ...position,
    duration,
    ease: 'power1.out',
  });
  // 크기
  gsap.to(sprite.scale, {
    ...scale,
    duration,
    ease: 'power1.out',
  });
  // 투명도 (나타났다가 사라지기)
  gsap
    .timeline()
    .to(sprite.material, {
      opacity: 1,
      duration: 0.3,
      ease: 'power1.in',
    })
    .to(sprite.material, {
      opacity: 0,
      duration: duration - 0.3,
      ease: 'power2.out',
      onComplete,
    });
};

const TailEffect: React.FC = () => {
  // 이펙트의 고정 위치 (꼬리 근처)
  const FIXED_POSITION: [number, number, number] = [0, 0, -0.1];

  // 파티클 2개 다 담아서 관리
  const effectGroup = useRef<THREE.Group>(null);
  const sprites = useRef<{
    cloud: THREE.Sprite[];
    sparkle: THREE.Sprite[];
  }>({ cloud: [], sparkle: [] });
  const loader = useMemo(() => new THREE.TextureLoader(), []);

  // 구름 파티클 만들기
  const createCloudEffect = () => {
    const texture = loader.load(EFFECTS.CLOUD.TEXTURE);

    for (let i = 0; i < EFFECTS.CLOUD.COUNT; i++) {
      // 원형으로 파티클 배치
      const angle = (i / EFFECTS.CLOUD.COUNT) * Math.PI * 2;
      const sprite = createSprite({
        texture,
        color: EFFECTS.CLOUD.COLOR || '#ffffff',
        blending: THREE.NormalBlending,
        fog: true,
      });

      const x = Math.cos(angle) * (Math.random() * EFFECTS.CLOUD.RADIUS);
      const y = Math.random() * 2 - 2;
      const z = Math.sin(angle) * (Math.random() * EFFECTS.CLOUD.RADIUS) - 0.25;

      sprite.position.set(x, y, z);
      sprite.scale.setScalar(EFFECTS.CLOUD.SCALE.START);

      animateSprite({
        sprite,
        position: {
          x: x * 2,
          y: y + 2,
          z: z * 2,
        },
        scale: {
          x: EFFECTS.CLOUD.SCALE.END + Math.random(),
          y: EFFECTS.CLOUD.SCALE.END + Math.random(),
          z: 1,
        },
        duration:
          EFFECTS.CLOUD.DURATION.MIN +
          Math.random() *
            (EFFECTS.CLOUD.DURATION.MAX - EFFECTS.CLOUD.DURATION.MIN),
        onComplete: () => {
          if (sprite.parent) {
            sprite.parent.remove(sprite);
          }
        },
      });

      effectGroup.current?.add(sprite);
      sprites.current.cloud.push(sprite);
    }
  };

  // 반짝이 파티클 만들기
  const createSparkleEffect = () => {
    const texture = loader.load(EFFECTS.SPARKLE.TEXTURE);

    for (let i = 0; i < EFFECTS.SPARKLE.COUNT; i++) {
      const sprite = createSprite({
        texture,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        fog: false,
      });

      // 구름과 다르게 원형 말고 랜덤 위치 배치
      const x = (Math.random() - 0.5) * EFFECTS.SPARKLE.RADIUS * 2;
      const y = Math.random() * 2 - 2.5;
      const z = (Math.random() - 0.5) * EFFECTS.SPARKLE.RADIUS * 2;

      sprite.position.set(x, y, z);
      sprite.scale.setScalar(EFFECTS.SPARKLE.SCALE.START);

      animateSprite({
        sprite,
        position: {
          x: x * 1.5,
          y: y + Math.random() * 2,
          z: z * 1.5,
        },
        scale: {
          x: EFFECTS.SPARKLE.SCALE.END,
          y: EFFECTS.SPARKLE.SCALE.END,
          z: EFFECTS.SPARKLE.SCALE.END,
        },
        duration:
          EFFECTS.SPARKLE.DURATION.MIN +
          Math.random() *
            (EFFECTS.SPARKLE.DURATION.MAX - EFFECTS.SPARKLE.DURATION.MIN),
        onComplete: () => {
          if (sprite.parent) {
            sprite.parent.remove(sprite);
          }
        },
      });

      effectGroup.current?.add(sprite);
      sprites.current.sparkle.push(sprite);
    }
  };

  // 메모리 정리 함수
  const cleanup = () => {
    [...sprites.current.cloud, ...sprites.current.sparkle].forEach((sprite) => {
      if (sprite.parent) {
        sprite.parent.remove(sprite);
      }
    });
    sprites.current = { cloud: [], sparkle: [] };
  };

  useEffect(() => {
    if (!effectGroup.current) return;

    cleanup();
    createCloudEffect();
    createSparkleEffect();

    return cleanup; // 컴포넌트 언마운트시 (hasTail이 false 되는 순간) 파티클 정리
  }, []);

  return <group ref={effectGroup} position={FIXED_POSITION} />;
};

export default React.memo(TailEffect);
