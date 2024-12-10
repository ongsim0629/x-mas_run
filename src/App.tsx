import { KeyboardControls } from '@react-three/drei';
import SoundControlHeader from './components/UI/SoundControlHeader';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQueryClientProvider from './components/ReactQueryClientProvider';
import { ErrorBoundary } from 'react-error-boundary';
import RenderErrorPage from './pages/RenderErrorPage';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import AuthRouter from './components/AuthRouter';
import { Suspense } from 'react';
import LoadingPage from './pages/LoadingPage';
import { BrowserRouter } from 'react-router-dom';
import { useIsMobile } from './hooks/useIsMobile';
import PlatformWarningModal from './components/UI/PlatformWarningModal';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'catch', keys: ['ShiftLeft', 'mousedown'] },
  { name: 'skill', keys: ['KeyQ'] },
  { name: 'item', keys: ['KeyE'] },
];

function App() {
  const { reset } = useQueryErrorResetBoundary();
  const isMobile = useIsMobile();

  if (isMobile === null) {
    return <LoadingPage />;
  }

  return (
    <>
      {isMobile ? (
        <PlatformWarningModal />
      ) : (
        <KeyboardControls map={keyboardMap}>
          <ReactQueryClientProvider>
            <ErrorBoundary FallbackComponent={RenderErrorPage} onReset={reset}>
              <Suspense fallback={<LoadingPage />}>
                <SoundControlHeader />
            <BrowserRouter>
                <AuthRouter />
            </BrowserRouter>
              </Suspense>
            </ErrorBoundary>
          </ReactQueryClientProvider>
          <ToastContainer
            position="top-center"
            autoClose={1000}
            hideProgressBar={true}
            closeOnClick
            theme="light"
            transition={Flip}
          />
        </KeyboardControls>
      )}
    </>
  );
}
export default App;
