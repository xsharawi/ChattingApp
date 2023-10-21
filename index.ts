import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import os from 'os';
import 'dotenv/config';
import * as db from "./DB/dataSource.js";

import userRoute from './routes/users.js';
import contactRoute from './routes/users.js';
import groupRoute from './routes/users.js';
import chatRoute from './routes/users.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const connectedClients = new Map<string, WebSocket>();

const PORT = process.env.PORT;
const HOST = os.hostname();

app.use('/user', userRoute(wss, connectedClients));
app.use('/chats', chatRoute(wss, connectedClients));
app.use('/groups', groupRoute(wss, connectedClients));
app.use('/user', contactRoute(wss, connectedClients));

app.use(express.json());

wss.on('connection', (ws, req) => {
  console.log('WebSocket client connected.');
  

  ws.on('message', (message) => {
    console.log(`Received from : ${message}`);
  });
});

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON http://${HOST}:${PORT}`);
  db.init();
});
