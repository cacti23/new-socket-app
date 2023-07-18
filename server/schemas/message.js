const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    room: String,
    sender: String,
    content: String
  },
  { createdAt: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
