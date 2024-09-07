import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const userSocketMap = {};
export const getReciverSocketId = (reciverId) => userSocketMap[reciverId];
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
        // console.log(`User connected: userId=${userId}, socketId=${socket.id}`);
    }

    // Emit the updated list of online users
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        if (userId) {
            // console.log(`User disconnected: userId=${userId}, socketId=${socket.id}`);

            // Remove user from the map and emit updated list of online users
            delete userSocketMap[userId];
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        }
    });
});

export { app, server, io };
