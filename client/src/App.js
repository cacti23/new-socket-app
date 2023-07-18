import './App.css';
import io from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';

import axios from 'axios';

const socket = io.connect('http://localhost:3001');

function App() {
  const roomRef = useRef('');
  const passphraseRef = useRef('');
  const messageRef = useRef('');
  const [messageReceived, setMessageReceived] = useState('');
  const [roomMessages, setRoomMessages] = useState([]);

  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);

  const createRoom = () => {
    const room = roomRef.current.value;
    const passphrase = passphraseRef.current.value;
    if (room !== '' && passphrase !== '') {
      socket.emit('create_room', { room, passphrase });
    }
  };

  const joinRoom = () => {
    const room = roomRef.current.value;
    const passphrase = passphraseRef.current.value;
    if (room !== '' && passphrase !== '') {
      socket.emit('join_room', { room, passphrase });
    }
  };

  const sendMessage = () => {
    const message = messageRef.current.value;
    socket.emit('send_message', { message, room: roomRef.current.value });
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageReceived(data.message);
    });

    socket.on('room_created', (data) => {
      alert(`Room ${data.room} created successfully.`);
      setHasJoinedRoom(true);
    });

    socket.on('room_exists', () => {
      alert('Room already exists. Please choose a different room name.');
    });

    socket.on('room_full', () => {
      alert('The room is full. Please try another room.');
    });

    socket.on('room_joined', (data) => {
      alert(`You have successfully joined room ${data.room}.`);
      setHasJoinedRoom(true);
    });

    socket.on('invalid_passphrase', () => {
      alert('Invalid passphrase. Please enter the correct passphrase.');
    });

    return () => {
      // Clean up socket event listeners when the component unmounts
      socket.off('receive_message');
      socket.off('room_created');
      socket.off('room_exists');
      socket.off('room_full');
      socket.off('room_joined');
      socket.off('invalid_passphrase');
    };
  }, []);

  useEffect(() => {
    const fetchRoomMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/messages/${roomRef.current.value}`
        );

        setRoomMessages(response.data);
      } catch (error) {
        console.log('Error fetching room messages:', error);
      }
    };

    if (hasJoinedRoom && roomRef.current.value) {
      fetchRoomMessages();
    }

    const interval = setInterval(() => {
      if (hasJoinedRoom && roomRef.current.value) {
        fetchRoomMessages();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [hasJoinedRoom]);

  const clearMessages = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/api/messages/${roomRef.current.value}`
      );
      setRoomMessages([]);
      alert('Messages cleared successfully');
    } catch (error) {
      console.log('Error clearing messages:', error);
    }
  };

  console.log(roomMessages);

  return (
    <div
      className='App'
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div style={{ marginBottom: '10px' }}>
        <input
          placeholder='Room Name...'
          ref={roomRef}
          style={{ marginRight: '10px' }}
        />
        <input
          placeholder='Passphrase...'
          ref={passphraseRef}
          style={{ marginRight: '10px' }}
        />
        <button onClick={createRoom}>Create Room</button>
        <button onClick={joinRoom}>Join Room</button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          placeholder='Message...'
          ref={messageRef}
          style={{ marginRight: '10px' }}
        />
        <button onClick={sendMessage}> Send Message</button>
      </div>

      <h1>Message:</h1>
      <div style={{ marginBottom: '10px' }}>{messageReceived}</div>

      <h2>{roomMessages?.length === 0 ? 'No Messages' : 'Room Messages:'}</h2>
      <ul>
        {roomMessages.map((msg) => (
          <li key={msg._id}>{msg.content}</li>
        ))}
      </ul>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={clearMessages}>Clear</button>
      </div>
    </div>

    // <div
    //   className='App'
    //   style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    // >
    //   <RoomForm createRoom={createRoom} joinRoom={joinRoom} />
    //   <MessageForm sendMessage={sendMessage} />

    //   <h1>Message:</h1>
    //   <div style={{ marginBottom: '10px' }}>{messageReceived}</div>

    //   <MessageList roomMessages={roomMessages} />

    //   <div style={{ marginBottom: '10px' }}>
    //     <button onClick={clearMessages}>Clear</button>
    //   </div>
    // </div>
  );
}

export default App;
