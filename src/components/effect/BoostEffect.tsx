import React, { useRef, useEffect, useMemo } from 'react';
import { Group, NormalBlending, Sprite, SpriteMaterial, TextureLoader, Vector3 } from 'three';
import gsap from 'gsap';

interface BoostEffectProps {
  targetPosition: Vector3;
}

const BoostEffect: React.FC<BoostEffectProps> = ({ targetPosition }) => {
  const BOOST_CONFIG = {
    COUNT: 2,
    RADIUS: 0.7,
    TEXTURE: 'images/fire.webp',
    SCALE: { START: 3, END: 0.5 },
    DURATION: { MIN: 5, MAX: 3 },
  };

  const loader = useMemo(() => new TextureLoader(), []);

  const texture = useMemo(() => loader.load(BOOST_CONFIG.TEXTURE), []);

  const effectGroup = useRef<Group>(null);
  const sprites = useRef<Sprite[]>([]);

  const createSprite = (): Sprite => {
    const material = new SpriteMaterial({
      map: texture,
      blending: NormalBlending,
      depthTest: false,
      transparent: true,
    });
    return new Sprite(material);
  };

  const animateSprite = (
    sprite: Sprite,
    onComplete: () => void,
  ): void => {
    const x = (Math.random() - 1) * BOOST_CONFIG.RADIUS;
    const y = -Math.random() * 0.5;
    const z = (Math.random() - 0.5) * BOOST_CONFIG.RADIUS;

    sprite.position.set(x, y, z);
    sprite.scale.setScalar(BOOST_CONFIG.SCALE.START);

    gsap
      .timeline()
      .to(sprite.position, {
        x: x * 1.5,
        y: y - 2,
        z: z,
        duration:
          BOOST_CONFIG.DURATION.MIN +
          Math.random() *
            (BOOST_CONFIG.DURATION.MAX - BOOST_CONFIG.DURATION.MIN),
        ease: 'power2.out',
      })
      .to(
        sprite.scale,
        {
          x: BOOST_CONFIG.SCALE.END,
          y: BOOST_CONFIG.SCALE.END,
          duration: BOOST_CONFIG.DURATION.MIN,
          ease: 'power1.in',
        },
        '<',
      )
      .to(
        sprite.material,
        {
          opacity: 0,
          duration: BOOST_CONFIG.DURATION.MIN,
          ease: 'power2.in',
          onComplete,
        },
        '<',
      );
  };

  const createEffect = () => {
    if (!effectGroup.current) return;

    for (let i = 0; i < BOOST_CONFIG.COUNT; i++) {
      const sprite = createSprite();
      animateSprite(sprite, () => {
        if (sprite.parent) sprite.parent.remove(sprite);
      });
      effectGroup.current.add(sprite);
      sprites.current.push(sprite);
    }
  };

  const cleanup = () => {
    sprites.current.forEach((sprite) => {
      if (sprite.parent) sprite.parent.remove(sprite);
    });
    sprites.current = [];
  };

  useEffect(() => {
    const interval = setInterval(createEffect, 150); // 간격 증가
    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (effectGroup.current) {
      effectGroup.current.position.set(
        targetPosition.x,
        targetPosition.y + 0.8,
        targetPosition.z - 3,
      );
      effectGroup.current.rotation.set(-Math.PI / 2, Math.PI, 0); // Changed from (Math.PI / 2, 0, 0)
    }
  }, [targetPosition]);

  return <group ref={effectGroup} />;
};

export default React.memo(BoostEffect);
