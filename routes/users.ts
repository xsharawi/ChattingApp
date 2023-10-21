import express from 'express';
import WebSocket from 'ws';
import { login } from '../controles/User.js';
import { User } from '../DB/entities/User.js';
import { postUser } from '../middleware/validation/valUser.js';
import { insertUser } from '../controles/User.js';
const router = express.Router();

const userRoute = (wss: WebSocket.Server, connectedClients: Map<string, WebSocket>) => {
  // Define WebSocket-related logic here
  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected.');

    ws.on('message', (message) => {
      console.log(`Received from : ${message}`);
    });
  });


  router.get('/', (req, res) => {
    res.send('User data'); 
  });
  router.post('/register' , postUser ,(req , res , next) =>{
    insertUser(req.body).then(() => {
        res.status(201).send()
      }).catch(err => {
        next(err);
      });
  })
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
        res.status(401).send('Login failed'); // User not found
      }
    } catch (err) {
      next({ error: err });
    }
  });
  

  router.post('/register', (req, res) => {
    res.send('User registration'); 
  });

  return router;
};

export default userRoute;
