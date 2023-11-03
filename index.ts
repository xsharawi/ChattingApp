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
import { Activateuser } from './DB/entities/Activateuser.js';
import { insertUser } from './controles/User.js';
import { User } from './DB/entities/User.js';
const app = express();
const errorHandler = (
  error: any , 
  req: express.Request , 
  res: express.Response , 
  next: express.NextFunction) =>{
    console.log("Error Message from Handler [Middle  Ware]");
    console.log(error);
    res.status(500).send("SomeThing Went Wrong !!??")
  }



const server = http.createServer(app);
const wss = new WebSocketServer({ server }); 
const connectedClients = new Map<string, WebSocket>();

const PORT = process.env.PORT || 3000;
const HOST = os.hostname();
app.use(express.json());
app.use('/user', userRoute(wss, connectedClients));
app.use('/chats', chatRoute(wss, connectedClients));
app.use('/groups', groupRoute);
app.use('/contacts', contactRoute);
app.use(errorHandler);
app.use(express.json());
app.get('/hello' , (req , res) =>{
  res.status(201).send("Hello")
})
app.get('/activate/:token', async (req , res) => {
  const activationToken = req.params.token as string || ''
  const findUser = await Activateuser.findOneBy({ id : activationToken });
  if (!findUser) {
    return res.status(404).json({ message: 'Activation token not found' });
  }
  if(findUser){
    const user = {
      password: findUser.password,
      username: findUser.username,
      bio: findUser.bio,
      image: findUser.image,
      dob: findUser.dob,
      email: findUser.email
    }
    await insertUser(user);
    await Activateuser.remove(findUser);
    res.status(200).send({message : "User created " , newUser : user })
  }
  else{
    res.status(404).send("User not found ")
  }

})
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
