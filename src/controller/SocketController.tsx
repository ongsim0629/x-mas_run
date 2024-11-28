import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { playerInfoAtom, playersAtom } from '../atoms/PlayerAtoms';
import { KillLogInfo, Position } from '../types/player';
import { gameTimeAtom, killLogsAtom } from '../atoms/GameAtoms';
import useSocket from '../hooks/useSocket';
import useKeyControl from '../hooks/useKeyControl'; // 새로 만든 훅 import

const SocketController = () => {
  const { socket } = useSocket();
  const prevPosition = useRef<Position>({ x: 0, y: 0, z: 0 });
  const [players, setPlayers] = useAtom(playersAtom);
  const player = useAtomValue(playerInfoAtom);
  const setTimer = useSetAtom(gameTimeAtom);
  const isInitialized = useRef(false);
  const [, setKillLogs] = useAtom(killLogsAtom);

  const getControls = useKeyControl();

  // steal 쿨타임 관리 ref
  const stealCooldown = useRef(false);
  const stealCooldownTimer = useRef<NodeJS.Timeout | null>(null);

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
      if (stealCooldownTimer.current) clearTimeout(stealCooldownTimer.current);
    };
  }, []);

  // 플레이어 움직임 처리
  const lastSentTime = useRef(Date.now());
  useEffect(() => {
    if (!socket || !player.id) return;
    const currentPlayer = players.find((p) => p.id === player.id);

    if (!currentPlayer) return;

    const now = Date.now();
    if (now - lastSentTime.current < import.meta.env.VITE_SEND_INTERVAL) return;

    if (!isInitialized.current) {
      prevPosition.current = currentPlayer.position;
      isInitialized.current = true;
      return;
    }

    const controls = getControls();
    const wantsToSteal = controls.catch;
    const shouldUpdatePosition =
      hasSignificantMovement(currentPlayer.position, prevPosition.current) ||
      wantsToSteal;

    if (shouldUpdatePosition) {
      if (wantsToSteal && !stealCooldown.current) {
        socket.updateMovement({
          character: currentPlayer,
          steal: true,
          skill: false,
        });
        stealCooldown.current = true;
        if (stealCooldownTimer.current)
          clearTimeout(stealCooldownTimer.current);
        stealCooldownTimer.current = setTimeout(
          () => (stealCooldown.current = false),
          1000,
        );
      } else {
        socket.updateMovement({
          character: currentPlayer,
          steal: false,
          skill: false,
        });
      }

      prevPosition.current = currentPlayer.position;
      lastSentTime.current = now;
    }
  }, [player.id, socket, players]);

  const hasSignificantMovement = useCallback(
    (current: Position, prev: Position): boolean =>
      Math.abs(current.x - prev.x) > import.meta.env.VITE_POSITION_THRESHOLD ||
      Math.abs(current.y - prev.y) > import.meta.env.VITE_POSITION_THRESHOLD ||
      Math.abs(current.z - prev.z) > import.meta.env.VITE_POSITION_THRESHOLD,
    [],
  );

  useEffect(() => {
    if (!socket || !player.id) return;

    const unsubscribeKillLog = socket.onKillLogUpdate(
      (killLog: KillLogInfo) => {
        setKillLogs((prev) => [...prev, killLog]);

        setTimeout(() => {
          setKillLogs((prev) => prev.slice(1));
        }, 3000);
      },
    );

    return () => {
      unsubscribeKillLog();
    };
  }, [socket, player.id, setKillLogs]);

  return null;
};

export default SocketController;
