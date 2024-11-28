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

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'catch', keys: ['ShiftLeft', 'KeyE', 'mousedown'] },
  { name: 'skill', keys: ['KeyQ', 'ControlLeft', 'ControlRight']},
];

function App() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <KeyboardControls map={keyboardMap}>
      <ReactQueryClientProvider>
        <ErrorBoundary FallbackComponent={RenderErrorPage} onReset={reset}>
          <Suspense fallback={<LoadingPage />}>
            <SoundControlHeader />
            <AuthRouter />
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
  );
}
export default App;
