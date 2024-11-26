import { FallbackProps } from 'react-error-boundary';

const RenderErrorPage = ({ resetErrorBoundary, error }: FallbackProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center flex-col">
      <img
        src={import.meta.env.VITE_ERROR_IMAGE_URL}
        className="absolute w-full h-full object-cover"
        alt="landing-error-image"
      />
      <div className="relative z-10 flex flex-col text-white gap-5">
        <h1 className="text-2xl">{error.message} 에러가 발생했어요😿</h1>
        <button
          aria-label="go-back-button"
          type="button"
          onClick={resetErrorBoundary}
          className="bg-white text-black rounded-lg py-2 text-lg"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default RenderErrorPage;
