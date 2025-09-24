import { io } from "socket.io-client";

let socket;

export const initSocket = (userId) => {
  socket = io("https://pro-connect-1-8mxk.onrender.com", {
    query: { userId },
    transports: ["websocket"],
  });
  return socket;
};

export const getSocket = () => socket;
