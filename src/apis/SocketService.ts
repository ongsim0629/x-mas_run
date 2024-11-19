import { io, Socket } from 'socket.io-client';
import { GameData, RoomInfo } from '../types/game';
import { Character, PlayerMovement } from '../types/player';

export class SocketService {
  private socket: Socket;
  private isInRoom = false;
  constructor() {
    this.socket = io(import.meta.env.VITE_DEV_SERVER_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 3,
    });
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
  enterRoom() {
    if (!this.connected) return;
    if (this.isInRoom) return;

    this.socket.emit('room.enter');
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

  onGameStart(handler: () => void) {
    this.socket.on('game.start', handler);
    return () => this.socket.off('game.start');
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
