import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import useApiError from '../hooks/useApiError';

const ReactQueryClientProvider = ({ children }: { children: ReactNode }) => {
  const { handleError } = useApiError();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: { onError: handleError },
          queries: {
            throwOnError: true,
          },
        },
        queryCache: new QueryCache({
          onError: handleError,
        }),
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryClientProvider;
