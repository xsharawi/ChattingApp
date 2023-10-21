// userRoute.ts
import express from 'express';
import WebSocket from 'ws';

const router = express.Router();

const chatRoute = (wss: WebSocket.Server, connectedClients: Map<string, WebSocket>) => {
  // Define WebSocket-related logic here
  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected.');


    ws.on('message', (message) => {
      console.log(`Received from : ${message}`);
    });
  });

  // Define routes for the /user path
  router.get('/', (req, res) => {
    res.send('User data'); // Replace with your user-related logic
  });

  router.post('/login', (req, res) => {
    res.send('User login'); // Replace with your login logic
  });

  router.post('/register', (req, res) => {
    res.send('User registration'); // Replace with your registration logic
  });

  return router;
};

export default chatRoute;
