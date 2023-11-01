import express from 'express';
import WebSocket from 'ws';
import { login, sendActivationEmail } from '../controles/User.js';
import { User } from '../DB/entities/User.js';
import { postUser } from '../middleware/validation/valUser.js';
import { insertUser } from '../controles/User.js';
import { authenticate } from '../middleware/auth/authenticate.js';
import { Groups } from '../DB/entities/Groups.js';
import bcrypt from 'bcrypt';
import { Activateuser } from '../DB/entities/Activateuser.js';
const router = express.Router();
const tokenPath = "http://localhost:3000/activate/"
const userRoute = (wss: WebSocket.Server, connectedClients: Map<string, WebSocket>) => {
    
  // Register a new user
  router.post('/register', postUser , async (req, res, next) => {
    const newUser = await Activateuser.create({
      ...req.body
    })
    const token = tokenPath + newUser.id;
    sendActivationEmail(newUser.email , token);
  });

  // Login a user and create a WebSocket connection if not already connected
  router.post('/login' , async (req, res, next) => {
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
          res.status(200).send({token : data.token , message: 'Welcome'}); // User already connected
        } else {
          const ws = new WebSocket('ws://localhost:3000'); // Adjust the WebSocket server URL
          ws.on('open', () => {
            console.log('WebSocket connection opened.');
            connectedClients.set(userId, ws);
            res.status(200).send({token: data.token , message: "Welcome1"});
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
    const userId = res.locals.user.id
    const { groupId } = req.body;
  
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

  router.post('/update', authenticate, async (req, res, next) => {
    try {
      const recognizedKeys = ['username', 'password', 'image', 'bio', 'dob'];
      const userId = res.locals.user.id
      const { ...requestBody } = req.body;
  
      let user = await User.findOneBy({ id: userId });
  
      if (!user) {
        return next({ error: 'User not found' });
      }
  
      for (const key of Object.keys(requestBody)) {
        if (recognizedKeys.includes(key)) {
          (user as any)[key] = requestBody[key];
        }
      }
  
      await user.save();
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
      next({ error: err });
    }
  });
  
  router.delete('/delete' , authenticate , async (req , res , next) =>{
    try {
      const userId = res.locals.user.id
      const { password} = req.body;
      
      const user = await User.findOneBy({id: userId});
      if(!user){
        next({error: `User not found in user/delete`});
      }
      const passwordMatching = await bcrypt.compare(password, user?.password || '');
      if(passwordMatching && user){
        await User.remove(user);
        await user.save();
        res.status(200).send("User Delete")
      }
      res.status(500).send("Not accureate info");

    }catch (err){
      next({error: err})
    }
  })
  router.post('/logout' , authenticate , (req , res) =>{
    const userId = res.locals.user.id;
    res.clearCookie('token');
    connectedClients.delete(userId)
  })
  return router;
};

export default userRoute;
