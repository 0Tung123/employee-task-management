import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE;

const socket = io(API_BASE_URL, {
  autoConnect: true,
  transports: ['websocket'],
  withCredentials: true,
  auth: {
    token: localStorage.getItem('token')
  }
});

socket.on('connect', () => {
});

socket.on('disconnect', (reason) => {
});

socket.on('connect_error', (error) => {
});

socket.on('reconnect', (attemptNumber) => {
});

socket.on('reconnect_attempt', (attemptNumber) => {
});

socket.on('reconnect_error', (error) => {
});

socket.on('reconnect_failed', () => {
});
export const updateSocketAuth = (token) => {
  socket.auth.token = token;
  if (!socket.connected) {
    socket.connect();
  } else {
    socket.disconnect();
    socket.connect();
  }
};

export default socket;
