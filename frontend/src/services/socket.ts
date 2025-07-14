import { Socket, io } from 'socket.io-client';
import type { User } from '../types';


class SocketService {
  private socket: Socket | null = null;
  private url: string;

  constructor() {
    this.url = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }

  connect() {
    this.socket = io(this.url);
    
    this.socket?.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket?.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onLeaderboardUpdate(callback: (users: User[]) => void) {
    if (this.socket) {
      this.socket.on('leaderboard-update', callback);
    }
  }

  offLeaderboardUpdate() {
    if (this.socket) {
      this.socket.off('leaderboard-update');
    }
  }
}

export default new SocketService();
