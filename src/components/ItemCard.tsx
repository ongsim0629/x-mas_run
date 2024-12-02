import { useCallback } from 'react';
import { ItemType } from '../types/game';

type Props = {
  itemType: ItemType[];
};

const ItemCard = ({ itemType }: Props) => {
  const getTypeImage = useCallback((type: number) => {
    let imgSrc = '';
    switch (type) {
      case 1:
        imgSrc = 'speedIcon.webp';
        break;
      case 2:
        imgSrc = 'shieldIcon.webp';
        break;
      case 3:
        imgSrc = 'thunderIcon.webp';
        break;
      case 4:
        imgSrc = 'giftIcon.webp';
        break;
    }
    return imgSrc;
  }, []);

  return (
    <div className="absolute top-20 left-10 z-30">
      {/* 두 번째 카드를 먼저 렌더링하고 첫 번째 카드가 그 위에 오도록 배치 */}
      {itemType[1] && (
        <div className="absolute left-8 -top-2 animate-appear w-20 h-20 rounded-lg overflow-hidden opacity-70 scale-90">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-500/20 animate-pulse" />
          <div className="absolute inset-0 border-2 border-blue-400/50 rounded-lg shadow-[inset_0_0_15px_rgba(168,85,247,0.5)]" />
          <div className="relative w-full h-full p-2 bg-gray-900/70 flex items-center justify-center">
            <img
              src={`/images/${getTypeImage(itemType[1])}`}
              className="w-12 h-12 animate-float"
              alt={getTypeImage(itemType[1])}
            />
          </div>
        </div>
      )}

      {itemType[0] && (
        <div className="animate-appear relative w-20 h-20 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 animate-pulse" />
          <div className="absolute inset-0 border-2 border-blue-300 rounded-lg shadow-[inset_0_0_15px_rgba(59,130,246,0.5)]" />
          <div className="relative w-full h-full p-2 bg-gray-900/70 flex items-center justify-center">
            <img
              src={`/images/${getTypeImage(itemType[0])}`}
              className="w-12 h-12 animate-float"
              alt={getTypeImage(itemType[0])}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
