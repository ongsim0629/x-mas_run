import { io, Socket } from 'socket.io-client';
import { GameData, RoomInfo } from '../types/game';
import {
  KillComboLogsInfo,
  KillLogInfo,
  PlayerMovement,
} from '../types/player';

export class SocketService {
  private socket: Socket;
  private isInRoom = false;
  private static instance: SocketService | null = null;
  constructor(private readonly userId: string) {
    this.socket = io(import.meta.env.VITE_DEV_SERVER_URL, {
      auth: {
        clientId: this.userId,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 3,
    });
  }

  public static getInstance(userId: string): SocketService {
    if (!this.instance) this.instance = new SocketService(userId);
    return this.instance;
  }

  get id() {
    return this.socket.id;
  }

  get connected() {
    return this.socket.connected;
  }

  disconnect() {
    this.socket.removeAllListeners();
    this.socket.disconnect();
  }

  // Room 관련
  enterRoom(charType: number) {
    if (!this.connected) return;
    if (this.isInRoom) return;

    this.socket.emit('room.enter', { charType });
    this.isInRoom = true;
  }

  leaveRoom() {
    if (this.connected) {
      this.socket.emit('room.leave');
    }
  }

  onRoomStateChange(handler: (state: RoomInfo) => void) {
    this.socket.on('room.changeState', handler);
    return () => this.socket.off('room.changeState');
  }

  onGameStartSoon(handler: () => void) {
    this.socket.on('game.ready', handler);
    return () => this.socket.off('game.ready');
  }

  onGameStart(handler: () => void) {
    this.socket.on('game.start', handler);
    return () => this.socket.off('game.start');
  }

  onGameOver(handler: ({ roomId }: { roomId: string }) => void) {
    this.socket.on('game.over', handler);
    this.isInRoom = false;
    return () => this.socket.off('game.over');
  }

  // Character 관련
  updateMovement(movement: PlayerMovement) {
    if (this.connected) {
      this.socket.emit('move', movement);
    }
  }

  onCharactersUpdate(handler: (gameData: GameData) => void) {
    this.socket.on('game.state', handler);
    return () => this.socket.off('game.state');
  }

  onKillLogUpdate(handler: (killData: KillLogInfo) => void) {
    this.socket.on('game.log.steal', handler);
    return () => this.socket.off('game.log.steal');
  }

  onComboKillLogUpdate(handler: (killData: KillComboLogsInfo) => void) {
    this.socket.on('game.log.steal-combo', handler);
    return () => this.socket.off('game.log.steal-combo');
  }

  // Connection 관련
  onConnect(handler: () => void) {
    this.socket.on('connect', handler);
    return () => this.socket.off('connect');
  }

  onDisconnect(handler: () => void) {
    this.socket.on('disconnect', handler);
    return () => this.socket.off('disconnect');
  }
}
