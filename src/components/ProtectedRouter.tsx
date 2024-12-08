import { useAtomValue } from 'jotai';
import { playerInfoAtom } from '../atoms/PlayerAtoms';
import { Navigate, Outlet } from 'react-router-dom';
import SocketController from '../controller/SocketController';

const ProtectedRoute = () => {
  const { id } = useAtomValue(playerInfoAtom);

  if (!id) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <SocketController />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
