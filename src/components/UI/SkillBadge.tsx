type Props = {
  img: string;
  name: string;
  desc1: string;
  desc2?: string;
};
const SkillBadge = ({ img, name, desc1, desc2 }: Props) => {
  return (
    <div
      className="absolute right-52 top-10 z-20 flex gap-2 items-center"
      aria-label="character-skill-badge"
    >
      <img
        src={`/images/${img}.svg`}
        alt="teleport-skill"
        className="w-20 h-20 p-3 rounded-2xl bg-5-purple-deep flex-shrink-0"
      />
      <div className="flex flex-col justify-center items-start text-black/80 w-80">
        <span className="font-semibold text-xl mb-1">{name}</span>
        <small className="text-black/70">{desc1}</small>
        <small className="text-black/70">{desc2}</small>
      </div>
    </div>
  );
};

export default SkillBadge;
