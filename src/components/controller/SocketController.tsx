import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { playerInfoAtom, playersAtom } from '../../atoms/PlayerAtoms';
import { Position } from '../../types/player';
import { useKeyboardControls } from '@react-three/drei';
import useSocket from '../../hooks/useSocket';
import { gameTimeAtom } from '../../atoms/GameAtoms';

const SocketController = () => {
  const { socket } = useSocket();
  const prevPosition = useRef<Position>({ x: 0, y: 0, z: 0 });
  const [players, setPlayers] = useAtom(playersAtom);
  const player = useAtomValue(playerInfoAtom);
  const setTimer = useSetAtom(gameTimeAtom);
  const isInitialized = useRef(false);
  const [, get] = useKeyboardControls();

  // shift 쿨타임 관리 ref 추가
  const shiftCooldown = useRef(false);
  const shiftCooldownTimer = useRef<NodeJS.Timeout | null>(null);

  // 마우스 이벤트 리스너 추가
  const isMouseDown = useRef(false);

  useEffect(() => {
    const handleMouseDown = () => {
      isMouseDown.current = true;
    };
    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // 소켓 이벤트 구독
  useEffect(() => {
    if (!socket) return;
    const unsubscribeConnect = socket.onConnect(() => {
      console.log('Hello');
    });
    const unsubscribeCharacters = socket.onCharactersUpdate(
      ({ characters: updatedPlayers, remainRunningTime }) => {
        setTimer(remainRunningTime);
        setPlayers(updatedPlayers);
      },
    );
    const unsubscribeDisconnect = socket.onDisconnect(() => {
      isInitialized.current = false;
    });
    return () => {
      unsubscribeConnect();
      unsubscribeCharacters();
      unsubscribeDisconnect();
    };
  }, [socket, setPlayers]);

  useEffect(() => {
    return () => {
      if (shiftCooldownTimer.current) clearTimeout(shiftCooldownTimer.current);
    };
  }, []);

  // 플레이어 움직임 처리
  useEffect(() => {
    if (!socket || !player.id) return;

    const currentPlayer = players.find((p) => p.id === player.id);
    if (!currentPlayer) return;

    if (!isInitialized.current) {
      prevPosition.current = currentPlayer.position;
      isInitialized.current = true;
      return;
    }

    const shouldUpdatePosition =
      hasSignificantMovement(currentPlayer.position, prevPosition.current) ||
      get().catch ||
      isMouseDown.current;

    if (shouldUpdatePosition) {
      socket.updateMovement({
        character: currentPlayer,
        shift: (get().catch || isMouseDown.current) && !shiftCooldown.current, // 쿨다운 중이면 false전송
      });

      if ((get().catch || isMouseDown.current) && !shiftCooldown.current) {
        shiftCooldown.current = true;
        shiftCooldownTimer.current = setTimeout(() => {
          shiftCooldown.current = false;
        }, 500);
      }

      prevPosition.current = currentPlayer.position;
    }
  }, [player.id, players, get]);

  const hasSignificantMovement = useCallback(
    (current: Position, prev: Position): boolean =>
      Math.abs(current.x - prev.x) > import.meta.env.VITE_POSITION_THRESHOLD ||
      Math.abs(current.y - prev.y) > import.meta.env.VITE_POSITION_THRESHOLD ||
      Math.abs(current.z - prev.z) > import.meta.env.VITE_POSITION_THRESHOLD,
    [],
  );

  return null;
};

export default SocketController;
