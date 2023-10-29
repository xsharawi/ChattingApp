import express from 'express';
import WebSocket from 'ws';
import { Request, Response, NextFunction } from 'express';
import { User } from '../DB/entities/User.js';
import { Chat } from '../DB/entities/Chat.js';
import { Groups } from '../DB/entities/Groups.js'; // Import the Groups entity
import { insertChat, insertChatGroup } from '../controles/Chat.js';
import { authenticate } from '../middleware/auth/authenticate.js';
import { valDeleteMsg } from '../middleware/auth/authorize.js';
import { Group_chats } from '../DB/entities/Group_chats.js';
import { group } from 'console';

const router = express.Router();

const chatRoute = (wss: WebSocket.Server, connectedClients: Map<string, WebSocket>) => {
  // Define a function to send a chat message to a receiver's WebSocket
  async function sendChatMessageToReceiver(receiverId: string, senderId: string, text: string, group_id?: string) {
    const receiverSocket = connectedClients.get(receiverId);
    if (receiverSocket) {
      const chatMessage: Record<string, string> = {
        senderId,
        text,
      };
      if(group_id){
        chatMessage.group_id = group_id;  
      }
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
        await insertChatGroup(req.body);

        groupMembers.forEach(memberId => {
          sendChatMessageToReceiver(memberId, senderId, text, group.id);
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
        const groupChat = await Group_chats.findOneBy({group_chat_id: chat_id});
        if(!user || !chat || !groupChat){
            next({error:`User or chat is not found`})
        }
        if(chat && user && chat.sender_id === user.id){
          chat.text = Text;
          chat.edited = true;
          await chat.save();
        }
        if(groupChat && user && user.id === groupChat.group_chat_id){
          groupChat.chat_text = Text;
          groupChat.edited = true;
          await groupChat.save();
        }
        else {
          res.status(500).send(" Message not change yet ");
        }
        res.status(200).send(`message changed`);

      } catch(err){
        next({error: err})
      }
  })

  router.delete('/delete', authenticate , valDeleteMsg ,  async (req, res, next) => {
    try {
      const {messageId} = req.body;
      const chat = await Chat.findOneBy({ chat_id: messageId });
      
      if (!chat) {
        return next({ error: 'User id or chat id not found in chat/delete' });
      }
  
      await Chat.remove(chat);
      await chat.save()
      res.status(200).send("chat delete from user");
    } catch (err) {
      next({ error: err });
    }
  });
  
  router.get('/search', authenticate, async (req, res, next) => {
    try {
      const chat_Text = req.query.chat_Text as string;
      const userId = req.query.userId as string;
  
      if (!chat_Text || !userId) {
        return res.status(400).json({ error: 'Both chat_Text and userId are required query parameters' });
      }
  
      const chats = await Chat.find({
        where: [
          { sender_id: userId },
          { receiver_id: userId },
        ],
        order: {
          sent_at: 'DESC',
        },
      });
  
      const filter = chats.filter((item) => item.text.toLowerCase().includes(chat_Text.toLowerCase()));
  
      if (filter.length === 0) {
        return res.status(404).json({ message: 'No matching chat messages found' });
      }
  
      res.status(200).json(filter);
    } catch (err) {
      next({ error: err });
    }
  });
  return router
} 

export default chatRoute;
