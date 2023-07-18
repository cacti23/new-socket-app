# Chat App 📱💬

This is a simple chat application built using Express, MongoDB, Socket.io, and React. The app allows users to create rooms, join existing rooms, and engage in real-time messaging. Each room is limited to only two participants. Messages are updated at regular intervals, and users have the option to delete their messages.

## Technologies Used

⚛️ React - JavaScript library for building user interfaces\
🚀 Express - Fast and minimalist web application framework for Node.js\
🗄️ MongoDB - Document database for storing chat data\
📡 Socket.io - Library for real-time, bidirectional, and event-based communication

## Features

✨ Create a Room: Users can create a new chat room and obtain a unique room identifier.\
🔗 Join a Room: Users can join an existing chat room using the room identifier.\
💬 Real-time Messaging: Participants in a room can exchange messages in real-time.\
⌛ Message Updates: Messages are updated automatically at regular intervals.\
❌ Message Deletion: Users can delete their own messages from the chat history.

## Getting Started

To run the chat application locally, follow the steps below:

1.  Clone the repository:

    shellCopy code

    `$ git clone https://github.com/cacti23/new-socket-app`

2.  Install dependencies:

        shellCopy code

        `$ cd new-socket-app

    $ npm install`

3.  Set up the environment variables:

    - Create a `.env` file in the root directory.
    - Add the following variables and specify your MongoDB connection string:

      cCopy code

      `MONGODB_URI=your-mongodb-connection-string`

4.  Start the server & server:

    `$ npm run start`
