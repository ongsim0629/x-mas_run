import { io, Socket } from 'socket.io-client';

export default class SocketClient {
  private socket: Socket;
  constructor() {
    this.socket = io(import.meta.env.VITE_DEV_SERVER_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 3,
    });
  }

  connect() {
    return this.socket;
  }

  disconnect() {
    this.socket.removeAllListeners();
    this.socket.disconnect();
  }

  emit(eventMsg: string, data?: any) {
    try {
      console.log('📤 Emitting event:', {
        event: eventMsg,
        data,
        socketId: this.socket.id,
        connected: this.socket.connected,
        timestamp: new Date().toISOString(),
      });

      this.socket.emit(eventMsg, data);
    } catch (error) {
      console.error('❌ Error emitting event:', {
        event: eventMsg,
        error,
        socketId: this.socket.id,
      });
    }
    // this.socket.emit(eventMsg, data);
  }

  on(eventMsg: string, handler: (...args: any[]) => void) {
    this.socket.on(eventMsg, handler);
  }

  off(eventMsg: string) {
    this.socket.off(eventMsg);
  }

  get id() {
    return this.socket.id;
  }

  get connected() {
    return this.socket.connected;
  }
}
