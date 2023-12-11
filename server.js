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

  socket.on('login', (username) => {
    users[username] = socket.id;
    console.log(`${username} logged in`);
    console.log(`${users[username]} logged in`);
    // console.log(`${users['100000027']} is id`);

    
  }); 

  socket.on('privateMessage', (data) => {
    // const toSocketId = users[to];
    // console.log(toSocketId)
    let username_from = data['username_from']
    let username_to = data['username_to']
    let message = data['message']
    let message_for_web = data['message_for_web']
    console.log(`${users[username_to]}`);

    console.log(message)

    // let username_from = Object.keys(users).find(username => users[username] === socket.id);

    if (users[username_to]) {
      // Send the private message to the specific user
      console.log('here')
      io.to(users[username_to]).emit('privateMessage', {username_from, username_to, message, message_for_web});

    } else {
      console.log(`User ${username_to} not found`);
    }
  });


  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
