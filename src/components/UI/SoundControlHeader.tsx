import useAudio from '../../hooks/useAudio';

const SoundControlHeader = () => {
  const { audioEnabled, setAudioEnabled } = useAudio();
  const handleAudioClick = () => {
    setAudioEnabled((prev) => !prev);
  };
  return (
    <button
      className="flex justify-end absolute top-5 right-5 z-20 "
      onClick={handleAudioClick}
      type="button"
      aria-label="sound-button"
    >
      {audioEnabled ? (
        <img
          src="/images/bell.svg"
          className="w-10 h-10 cursor-pointer text-white my-2 hover:scale-110"
        />
      ) : (
        <img
          src="/images/bellMute.svg"
          className="w-10 h-10 cursor-pointer text-white my-2 hover:scale-110"
        />
      )}
    </button>
  );
};

export default SoundControlHeader;
