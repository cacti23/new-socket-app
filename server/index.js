const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./utils/db');
const Message = require('./schemas/message');

require('dotenv').config();

app.use(cors());
app.use(express.json());
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Map to store passphrase for each room
const roomPassphrases = new Map();

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('create_room', (data) => {
    const { room, passphrase } = data;

    if (!roomPassphrases.has(room)) {
      roomPassphrases.set(room, passphrase);
      socket.join(room);
      socket.emit('room_created', { room });
    } else {
      socket.emit('room_exists');
    }
  });

  socket.on('join_room', (data) => {
    const { room, passphrase } = data;

    if (roomPassphrases.has(room) && roomPassphrases.get(room) === passphrase) {
      const clients = io.sockets.adapter.rooms.get(room);

      if (!clients || clients.size < 2) {
        socket.join(room);
        socket.emit('room_joined', { room });
      } else {
        socket.emit('room_full');
      }
    } else {
      socket.emit('invalid_passphrase');
    }
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);

    const message = new Message({
      room: data.room,
      roomId: socket.id,
      content: data.message
    });

    message.save().catch((error) => {
      console.log('Error saving message:', error);
    });
  });
});

app.get('/api/messages/:room', async (req, res) => {
  const roomId = req.params.room;
  console.log({ roomId });

  try {
    const messages = await Message.find({});

    console.log(messages);

    res.json(messages);
  } catch (error) {
    console.log('Error retrieving messages:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

app.delete('/api/messages/:room', async (req, res) => {
  const roomId = req.params.room;

  try {
    await Message.deleteMany({ roomId });
    res.json({ message: 'Messages deleted successfully' });
  } catch (error) {
    console.log('Error deleting messages:', error);
    res.status(500).json({ error: 'Failed to delete messages' });
  }
});

server.listen(3001, () => {
  console.log('SERVER IS RUNNING');
});
