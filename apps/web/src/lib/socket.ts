import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@deceit/game-types';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  if (!socket) {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';
    socket = io(wsUrl, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}
