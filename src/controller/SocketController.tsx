import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { playerInfoAtom, playersAtom } from '../atoms/PlayerAtoms';
import { KillComboLogsInfo, KillLogInfo, Position } from '../types/player';
import {
  gameItemsAtom,
  gameTimeAtom,
  KillComboLogsAtom,
  killLogsAtom,
} from '../atoms/GameAtoms';
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
  const [, setComboKillLogs] = useAtom(KillComboLogsAtom);
  const setGameItems = useSetAtom(gameItemsAtom);

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
      ({ characters: updatedPlayers, remainRunningTime, mapItems }) => {
        setTimer(remainRunningTime);
        setPlayers(updatedPlayers);
        setGameItems(mapItems);
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
    const wantsToUseSkill = controls.skill;
    const shouldUpdatePosition =
      hasSignificantMovement(currentPlayer.position, prevPosition.current) ||
      wantsToSteal ||
      wantsToUseSkill;

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
      } else if (wantsToUseSkill) {
        // 스킬 사용 요청만 전송 (쿨타임은 서버에서 관리)
        socket.updateMovement({
          character: currentPlayer,
          steal: false,
          skill: true,
        });
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
  }, [player.id, socket, players, getControls]);

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

    const unsubscribeKillComboLog = socket.onComboKillLogUpdate(
      (comboLogs: KillComboLogsInfo) => {
        setComboKillLogs((prev) => [...prev, comboLogs]);

        setTimeout(() => {
          setComboKillLogs((prev) => prev.slice(1));
        }, 5000);
      },
    );

    return () => {
      unsubscribeKillLog();
      unsubscribeKillComboLog();
    };
  }, [socket, player.id, setKillLogs, setComboKillLogs]);

  return null;
};

export default SocketController;
