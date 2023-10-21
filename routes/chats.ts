import express from 'express';
import WebSocket from 'ws';
import { Request, Response, NextFunction } from 'express';
import { User } from '../DB/entities/User.js';
import { Chat } from '../DB/entities/Chat.js';
import { insertChat } from '../controles/Chat.js';

const router = express.Router();

const chatRoute = (wss: WebSocket.Server, connectedClients: Map<string, WebSocket>) => {
  // Define a function to send a chat message to the receiver's WebSocket
  async function sendChatMessageToReceiver(receiverId: string, senderId: string, text: string) {
    const receiverSocket = connectedClients.get(receiverId);
    if (receiverSocket) {
      const chatMessage = {
        senderId,
        text,
      };
      receiverSocket.send(JSON.stringify(chatMessage));
    }
  }

  // Define the /chat/add route
  router.post('/add', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the sender ID, receiver ID, and message from the request body
      const { senderId, receiverId, text } = req.body;

      // Validate sender and receiver
      const sender = await User.findOneBy({ id: senderId });
      const receiver = await User.findOneBy({ id: receiverId });

      if (!sender || !receiver) {
        return next({ error: 'Sender or receiver not found' });
      }

      // Insert chat message and send it to the receiver
      await insertChat(req.body);
      sendChatMessageToReceiver(receiverId, senderId, text);
      
      // Send a response
      res.status(200).send('Message sent');
    } catch (error) {
      next({ error: 'Failed to send message' });
    }
  });

  return router;
};

export default chatRoute;
