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
import useKeyControl from '../hooks/useKeyControl';

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
  const lastControls = useRef<ReturnType<typeof getControls>>();

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
    const controls = getControls();

    // 중요 키 입력(스킬, 아이템 사용 등) 감지
    const hasImportantInput =
      (controls.skill &&
        (!lastControls.current || !lastControls.current.skill)) ||
      (controls.item &&
        (!lastControls.current || !lastControls.current.item)) ||
      (controls.catch && !stealCooldown.current);

    // 일반 이동은 기존 인터벌로 처리
    const shouldUpdatePosition =
      (now - lastSentTime.current >= import.meta.env.VITE_SEND_INTERVAL &&
        hasSignificantMovement(currentPlayer.position, prevPosition.current)) ||
      hasImportantInput;

    if (shouldUpdatePosition) {
      if (controls.catch && !stealCooldown.current) {
        socket.updateMovement({
          character: currentPlayer,
          steal: true,
          skill: false,
          item: false,
        });
        stealCooldown.current = true;
        if (stealCooldownTimer.current)
          clearTimeout(stealCooldownTimer.current);
        stealCooldownTimer.current = setTimeout(
          () => (stealCooldown.current = false),
          1000,
        );
      } else if (controls.skill) {
        socket.updateMovement({
          character: currentPlayer,
          steal: false,
          skill: true,
          item: false,
        });
      } else if (controls.item) {
        socket.updateMovement({
          character: currentPlayer,
          steal: false,
          skill: false,
          item: true,
        });
      } else {
        socket.updateMovement({
          character: currentPlayer,
          steal: false,
          skill: false,
          item: false,
        });
      }

      prevPosition.current = currentPlayer.position;
      lastSentTime.current = now;
    }

    lastControls.current = controls;
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
