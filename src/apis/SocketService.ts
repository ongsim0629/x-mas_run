import { RoomInfo } from '../types/game';
import { Character, PlayerMovement } from '../types/player';
import SocketClient from './SocketClient';

export class SocketService {
  constructor(private readonly socket: SocketClient) {}

  // Room 관련
  enterRoom() {
    this.socket.emit('room.enter');
  }

  leaveRoom() {
    this.socket.emit('room.leave');
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
    this.socket.emit('move', movement);
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
