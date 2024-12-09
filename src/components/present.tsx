import { Gift } from '../models/Gift';
import { GIFT_COLORS } from '../types/gift';
import GiftEffect from './effect/GiftEffect';

type Props = {
  index: number;
  isTransparent?: boolean;
  isLocalPlayer?: boolean;
  charType?: 1 | 2 | 3;
};

export const Present = ({
  index,
  isTransparent,
  isLocalPlayer,
  charType,
}: Props) => {
  const opacity = isTransparent ? (isLocalPlayer ? 0.5 : 0) : 1;
  // 산타인 경우 선물 조금 더 높이 위치 시키기
  const baseHeight = charType === 2 ? 1.6 : 0.8;

  return (
    <group position={[-0.8, baseHeight + index * 0.8, 0.8]}>
      <Gift
        scale={[0.3, 0.3, 0.3]}
        colors={{
          'Material.002': GIFT_COLORS[index % GIFT_COLORS.length].main,
          'Material.008': GIFT_COLORS[index % GIFT_COLORS.length].main,
        }}
        opacity={opacity}
      />
      <GiftEffect />
    </group>
  );
};
