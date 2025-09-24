// socket.js
import { io } from "socket.io-client";

const socket = io("https://pro-connect-1-8mxk.onrender.com", {
  withCredentials: true,
  autoConnect: true,
});

export default socket;
