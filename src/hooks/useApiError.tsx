import { useCallback } from 'react';
import { toast } from 'react-toastify';
type HttpStatus = number;

const defaultHandler = (httpMessage: string = '에러가 발생했어요🥲') => {
  toast.error(httpMessage);
};

const handlers: Record<HttpStatus | string, (msg: string) => void> = {
  default: defaultHandler,
};
const useApiError = () => {
  const handleError = useCallback((error: Error) => {
    const httpMessage: string = error.message;
    handlers.default(httpMessage);
  }, []);
  return { handleError };
};

export default useApiError;
