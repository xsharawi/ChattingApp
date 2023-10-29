import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import os from 'os';
import 'dotenv/config';
import * as db from './DB/dataSource.js';
import { WebSocketServer } from "ws";
import userRoute from './routes/users.js';
import contactRoute from './routes/contacts.js'; 
import groupRoute from './routes/groups.js';
import chatRoute from './routes/chats.js'; 

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server }); 
const connectedClients = new Map<string, WebSocket>();

const PORT = process.env.PORT;
const HOST = os.hostname();

app.use('/user', userRoute(wss, connectedClients));
app.use('/chats', chatRoute(wss, connectedClients));
app.use('/groups', groupRoute);
app.use('/contacts', contactRoute);

app.use(express.json());

wss.on('connection', (ws, req) => {
  console.log('WebSocket client connected.');

  ws.on('message', (message) => {
    console.log(`Received from : ${message}`);
  });
});

const startServer = async () => {
  try {
    await db.init(); // Initialize the database
    server.listen(PORT, () => {
      console.log(`SERVER RUNNING ON http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize the database:', error);
  }
};
startServer();
