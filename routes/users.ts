import express from 'express';
import WebSocket from 'ws';
import { login } from '../controles/User.js';
import { User } from '../DB/entities/User.js';
import { postUser } from '../middleware/validation/valUser.js';
import { insertUser } from '../controles/User.js';
import { authenticate } from '../middleware/auth/authenticate.js';
import { Groups } from '../DB/entities/Groups.js';

const router = express.Router();

const userRoute = (wss: WebSocket.Server, connectedClients: Map<string, WebSocket>) => {
    
  // Register a new user
  router.post('/register', postUser, (req, res, next) => {
    insertUser(req.body)
      .then(() => {
        res.status(201).send();
      })
      .catch((err) => {
        next(err);
      });
  });

  // Login a user and create a WebSocket connection if not already connected
  router.post('/login', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
      const data = await login(email, password);
      if (!data) {
        res.status(401).send('Login failed');
        return;
      }

      const user = await User.findOneBy({ email });
      if (user) {
        const userId = user.id;

        // Check if a WebSocket connection for this user already exists
        if (connectedClients.has(userId)) {
          res.status(200).send('Welcome'); // User already connected
        } else {
          const ws = new WebSocket('ws://localhost:3000'); // Adjust the WebSocket server URL
          ws.on('open', () => {
            console.log('WebSocket connection opened.');
            connectedClients.set(userId, ws);
            res.status(200).send('Welcome');
          });
        }
      } else {
        next({error: 'Login failed'}); // User not found
      }
    } catch (err) {
      next({ error: err });
    }
  });

  router.post('/join', authenticate, async (req, res) => {
    const { userId, groupId } = req.body;
  
    try {
      const sender = await User.findOneBy({ id: userId });
      const group = await Groups.findOneBy({ id: groupId });
  
      if (!sender || !group) {
        return res.status(404).json({ error: 'User or group not found' });
      }
  
      group.Group_id.user.push(userId);
      await group.save();
  
      return res.status(200).send('User joined the group successfully');
    } catch (error) {
      return res.status(500).json({ error: 'Failed to join the group' });
    }
  });

  return router;
};

export default userRoute;
