interface Star {
  id: number;
  top: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
}

export const generateStars = (count: number): Star[] => {
  return [...Array(count)].map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${1 + Math.random() * 2}s`,
  }));
};

const Star = ({ star }: { star: Star }) => (
  <div
    className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
    style={{
      top: star.top,
      left: star.left,
      animationDelay: star.animationDelay,
      animationDuration: star.animationDuration,
    }}
  />
);

export default Star;
