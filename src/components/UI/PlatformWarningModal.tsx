const PlatformWarningModal = () => {
  return (
    <div className="fixed inset-0 bg-[#06493e]  overflow-y-auto">
      <div className="flex flex-col items-center min-h-screen p-4 text-white text-center">
        <h2 className="text-4xl font-bold mb-4 mt-8">X-MAS RUN</h2>
        <p className="text-xl mb-8">
          이 게임은 PC에서만 실행됩니다. PC로 접속해 주세요!
        </p>
        <img
          src="/images/mobile.webp"
          alt="PC only"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default PlatformWarningModal;
