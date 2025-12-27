const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// 1. The Server holds the "Source of Truth"
// Initialize it with a welcome message so it's never just empty
let documentContent = "<div>Welcome! Start collaborating...</div>"; 

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // 2. IMMEDIATELY send the new user the current text history
  socket.emit('text-update', documentContent);

  // 3. Listen for text changes
  socket.on('text-change', (newText) => {
    // Log for debugging
    console.log(`Update from ${socket.id}: ${newText.substring(0, 20)}...`);
    
    // Save it to memory
    documentContent = newText;
    
    // Broadcast to everyone ELSE
    socket.broadcast.emit('text-update', documentContent);
  });

  // 4. Cursor Logic (With Names)
  socket.on('cursor-move', (data) => {
    socket.broadcast.emit('cursor-move', data);
  });

  // 5. Chat Logic
  socket.on('send-chat', (data) => {
    io.emit('receive-chat', data);
  });

  socket.on('disconnect', () => {
    io.emit('user-disconnected', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});