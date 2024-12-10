const PlatformWarningModal = () => {
  return (
    <div className="fixed inset-0 bg-[#06493e] overflow-y-auto">
      <div className="flex flex-col items-center min-h-screen p-4 text-white text-center">
        <h3 className="text-4xl font-bold mb-4 mt-8">산타가 기다려요!🎅</h3>
        <p className="text-xl mb-8">
          X-MAS RUN은 <br /> PC에서만 즐길 수 있어요! <br />
          PC로 접속하고 <br />
          크리스마스 대모험을 시작해보세요! <br /> (ง •̀ω•́)ง✨
        </p>

        <div className="mb-8 text-left max-w-2xl">
          <h3 className="text-2xl font-semibold mb-2">X-mas Run 소개 🎮🎄</h3>
          <p className="mb-2">
            "X-mas Run은 크리스마스 테마의 멀티플레이어 달리기 게임입니다! 주요
            기능과 해결한 문제들이 한눈에 보이도록 구성된 프레젠테이션을
            확인해보세요."
          </p>
          <ul className="list-disc list-inside">
            <li>
              <strong>기능 소개</strong>: 간편한 시작, 보상 시스템, 로그로
              확인하는 플레이 통계.
            </li>
            <li>
              <strong>성능 개선</strong>: PPS 최적화와 프레임 드랍 문제 해결로
              원활한 플레이 경험 제공.
            </li>
            <li>
              <strong>기술 스택</strong>: R3F, Node.js, Redis 등 다양한 기술이
              활용된 프로젝트입니다.
            </li>
          </ul>
          <p className="mt-2">
            더 자세한 내용은 이미지 속 슬라이드를 확인해보세요! ☃️🖥️
          </p>
        </div>

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
