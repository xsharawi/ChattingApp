import express from 'express';
import WebSocket from 'ws';
import { Request, Response, NextFunction } from 'express';
import { User } from '../DB/entities/User.js';
import { Chat } from '../DB/entities/Chat.js';
import { Groups } from '../DB/entities/Groups.js'; // Import the Groups entity
import { insertChat } from '../controles/Chat.js';
import { authenticate } from '../middleware/auth/authenticate.js';

const router = express.Router();

const chatRoute = (wss: WebSocket.Server, connectedClients: Map<string, WebSocket>) => {
  // Define a function to send a chat message to a receiver's WebSocket
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
  router.post('/add', authenticate , async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { senderId, receiverId, text } = req.body;
      const sender = await User.findOneBy({ id: senderId });
      if (!sender) {
        return next({ error: 'Sender not found' });
      }

      const group = await Groups.findOneBy({ id:receiverId });

      if (group) {

        const groupMembers = group.Group_id.user.map(member => member.id);
        if (!groupMembers.includes(senderId)) {
          next({error: `the sender is not member in the group`})
        }
        await insertChat(req.body);

        groupMembers.forEach(memberId => {
          sendChatMessageToReceiver(memberId, senderId, text);
        });
        res.status(200).send('Message sent to the group');
      } else {
        const { receiverId } = req.body;
        const receiver = await User.findOneBy({ id: receiverId });

        if (receiver) {
          await insertChat(req.body);
          sendChatMessageToReceiver(receiverId, senderId, text);
          res.status(200).send('Direct message sent');
        } else {
          return next({ error: 'Receiver not found' });
        }
      }
    } catch (error) {
      next({ error: 'Failed to send message' });
    }
  });

  router.put('/edit' , authenticate , async(req , res , next) =>{
      const {chat_id , user_id , Text} = req.body;
      try{
        const user = await User.findOneBy({id: user_id});
        const chat = await Chat.findOneBy({chat_id: chat_id});
        if(!user || !chat){
            next({error:`User or chat is not found`})
        }
        if(chat){
          chat.text = Text;
          chat.edited = true;
        }

      } catch(err){
        next({error: err})
      }
  })

  return router;
};

export default chatRoute;
