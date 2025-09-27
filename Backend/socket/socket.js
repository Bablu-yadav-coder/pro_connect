import express from "express";
import { Server } from "socket.io"
import { createServer } from "http";
import cors from "cors"

const app = express();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
})

const userSocketMap = {}; // stote socket id of  user


export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];


io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
    }


    io.emit("getOnlineUsers", Object.keys(userSocketMap));



    socket.on("disconnect", () => {
        if (userId) {
           
            delete userSocketMap[userId]
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

    });

})


export { app, server, io };

