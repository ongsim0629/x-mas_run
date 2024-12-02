import { useCallback } from 'react';
import { ItemType } from '../types/game';

type Props = {
  itemType: ItemType[];
};

const ItemCard = ({ itemType }: Props) => {
  const getTypeImage = useCallback((type: number) => {
    let imgSrc = '';
    switch (type) {
      case 1: // boost
        imgSrc = 'speedIcon.webp';
        break;
      case 2: //shield
        imgSrc = 'shieldIcon.webp';
        break;
      case 3: // thunder
        imgSrc = 'thunderIcon.webp';
        break;
      case 4: // gift
        imgSrc = 'giftIcon.webp';
        break;
    }
    return imgSrc;
  }, []);
  return (
    <div className="absolute top-20 left-10 z-30">
      <div className="absolute w-20 h-24 bg-white rounded-md flex justify-center items-center z-20 border-3-xmas-gold border-4 shadow-md">
        <img
          src={`/images/${getTypeImage(itemType[0])}`}
          className="w-12 h-12"
          alt={getTypeImage(itemType[0])}
        />
      </div>
      {itemType[1] ? (
        <div className="absolute left-8 w-20 h-24 bg-white/50 rounded-md flex justify-center items-center border-3-xmas-gold/30 border-4 shadow-md">
          <img
            src={`/images/${getTypeImage(itemType[1])}`}
            className="w-12 h-12"
            alt={getTypeImage(itemType[1])}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ItemCard;
