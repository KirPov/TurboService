// src/api/socket.ts
import { io } from 'socket.io-client';

export const socket = io('http://localhost:4100', {
  transports: ['websocket'],
});
