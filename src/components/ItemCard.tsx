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
      <div
        data-item-index="1"
        className="absolute left-20 top-9 w-14 h-16 rounded-lg overflow-hidden opacity-70 scale-90"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-500/20 animate-pulse" />
        <div className="absolute inset-0 border-2 border-blue-300/50 rounded-lg shadow-xl" />
        <div className="relative w-full h-full p-2 bg-gray-900/70 flex items-center justify-center">
          {itemType[1] && (
            <img
              src={`/images/${getTypeImage(itemType[1])}`}
              className="w-9 h-9"
              alt={getTypeImage(itemType[1])}
            />
          )}
        </div>
      </div>

      <div
        data-item-index="0"
        className="relative w-20 h-24 rounded-lg overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 animate-pulse" />
        <div className="absolute inset-0 border-2 border-blue-300 rounded-lg shadow-xl" />
        <div className="relative w-full h-full p-2 bg-gray-900/70 flex items-center justify-center">
          {itemType[0] && (
            <img
              src={`/images/${getTypeImage(itemType[0])}`}
              className="w-12 h-12 animate-float"
              alt={getTypeImage(itemType[0])}
            />
          )}
        </div>
      </div>
      <div className="flex justify-center mt-1">
        <div className="mt-1 px-2 py-0.5 bg-gray-800 rounded text-sm text-gray-300">
          E 버튼
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
