const Snow = () => {
  const snowflakes = Array.from({ length: 50 }).map((_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 3 + 2}s`,
    animationDelay: `${Math.random() * 2}s`,
    opacity: Math.random(),
    size: `${Math.random() * 0.5 + 0.2}rem`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute animate-fall"
          style={{
            left: flake.left,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
          }}
        >
          <div className="w-full h-full bg-white rounded-full" />
        </div>
      ))}
    </div>
  );
};
export default Snow;
