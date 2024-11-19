import { io, Socket } from 'socket.io-client';
import { RoomInfo } from '../types/game';
import { Character, PlayerMovement } from '../types/player';

export class SocketService {
  private socket: Socket;
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
    if (!this.connected) {
      console.warn('Socket is not connected');
      return;
    }
    console.log('Entering room with socket id:', this.id);
    this.socket.emit('room.enter');
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

  onCharactersUpdate(handler: (characters: Character[]) => void) {
    this.socket.on('characters', handler);
    return () => this.socket.off('characters');
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
