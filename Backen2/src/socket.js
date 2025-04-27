import express from 'express';
import { Server } from 'socket.io'
import http from 'http'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: ["https://chaa-tting-app.onrender.com"],
        // methods:["GET","POST"],
        credentials: true
    }
})

const useSocketmap = {};

export const getSocketId=(userId)=>{
    return useSocketmap[userId]
}

io.on('connection', (socket) => {
    console.log("A user connected", socket.id)

    const userId = socket.handshake.query.userId
    if (!userId) return socket.disconnect(true)
    useSocketmap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(useSocketmap))
    console.log("userId", userId)
    socket.on('disconnect', () => {
        console.log("A user disconnected", socket.id)
        delete useSocketmap[userId]
        io.emit("getOnlineUsers", Object.keys(useSocketmap))
    })
})

export { io, app, server }
