import { useCallback } from 'react';
import { toast } from 'react-toastify';
import ApiError from '../apis/ApiError';
type HttpStatus = number;

const defaultHandler = (httpMessage: string = '에러가 발생했어요🥲') => {
  toast.error(httpMessage);
};

const handlers: Record<HttpStatus | string, (msg: string) => void> = {
  default: defaultHandler,
};
const useApiError = () => {
  const handleError = useCallback((error: ApiError | Error) => {
    if (error instanceof ApiError) {
      const httpStatus: number = error.status;
      const httpMessage: string = error.message;
      if (httpStatus && handlers[httpStatus]) {
        handlers[httpStatus](httpMessage);
      }
      handlers.default(httpMessage);
    } else {
      handlers.default('알 수 없는 에러가 발생했어요. 다시 시작해주세요🥲');
    }
  }, []);
  return { handleError };
};

export default useApiError;
