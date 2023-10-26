import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dynamic from 'next/dynamic';

const DynamicLayoutWithNoSSR = dynamic(() => import('@/components/Layout'), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <DynamicLayoutWithNoSSR>
        <Component {...pageProps} />
        <ToastContainer />
      </DynamicLayoutWithNoSSR>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}
