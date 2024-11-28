import { Gift } from '../models/Gift';
import { GIFT_COLORS } from '../types/gift';
import GiftEffect from './effect/GiftEffect';

type Props = {
  index: number;
  isTransparent?: boolean;
};
export const Present = ({ index, isTransparent }: Props) => {
  const opacity = isTransparent ? 0.1 : 1;
  return (
    <group position={[-0.8, 0.8 + index * 0.8, 0.8]}>
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
