// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Import the cors middleware

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Enable CORS for all routes
app.use(cors());

io.attach(server, {
    cors: {
      origin: ['http://localhost:3001', 'https://port-0-folder-web-app-32updzt2alppbaefq.sel4.cloudtype.app', '*'], // Set the allowed origins
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

const users = {};


io.on('connection', (socket) => {
  console.log(`A user connected. Socket ID: ${socket.id}`);
  console.log('A user connected');

  // Handle events from the client
  socket.on('message', (msg) => {
    console.log('Message from client:', msg);
    // Broadcast the message to all connected clients
    io.emit('message', msg);
  });


  socket.on('login', (channel) => {
    // Ensure that the user is associated with the specified channels
    if (!users[channel]) {
      users[channel] = [];
    }

    // Add the user's socket.id to the channel
    users[channel].push(socket.id);
  
    console.log(`${socket.id} logged in to channel: ${channel}`);
    console.log('Current state of users:', users);

    io.emit('login_response', 1)

  });


  socket.on('privateMessage', (data) => {
    let username_from = data['username_from'];
    let username_to = data['username_to'];
    let message = data['message'];
    let message_for_web = data['message_for_web'];
    let selected_job_id_list = data['selected_job_id_list']
  
    console.log(`${users[username_to]}`);
    console.log(message);
  
    if (users[username_to]) {
      // Send the private message to all users in the channel, including the sender
      users[username_to].forEach((socketId) => {
        console.log('here');
        io.to(socketId).emit('privateMessage', { username_from, channel: username_to, message, message_for_web, selected_job_id_list});
      });
    } else {
      console.log(`Channel/User ${username_to} not found`);
    }
  });

  socket.on('privateMessage1', (data) => {
    let username_from = data['username_from'];
    let username_to = data['username_to'];
    let message = data['message'];
    let message_for_web = data['message_for_web'];
    let selected_job_id_list = data['selected_job_id_list']
  
    console.log(`${users[username_to]}`);
    console.log(message);
  
    if (users[username_to]) {
      // Send the private message to all users in the channel, including the sender
      users[username_to].forEach((socketId) => {
        console.log('here');
        io.to(socketId).emit('privateMessage1', { username_from, channel: username_to, message, message_for_web, selected_job_id_list});
      });
    } else {
      console.log(`Channel/User ${username_to} not found`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected. Socket ID: ${socket.id}`);
    
    // Remove the disconnected user's socket ID from the users object
    Object.keys(users).forEach((channel) => {
      users[channel] = users[channel].filter((socketId) => socketId !== socket.id);
      if (users[channel].length === 0) {
        delete users[channel];
      }
    });

    console.log('Current state of users:', users);
  });
  
});


const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
