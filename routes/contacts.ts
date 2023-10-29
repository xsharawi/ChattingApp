// userRoute.ts
import express from 'express';
import WebSocket from 'ws';
import { authenticate } from '../middleware/auth/authenticate.js';
import { Contact } from '../DB/entities/Contacts.js';
const router = express.Router();

router.get('/contacts' , authenticate , async (req , res , next) =>{
  try{
    const {userId} = req.body;
    const user = await  Contact.findOneBy({id: userId});
    if(!user)
      next({error: `User not found in contact/contacts`});
    const Data = user?.Contacts.map(user => ({ id: user.id, username: user.username }));
    res.status(200).send(Data);
  }catch(err){
    next({error: err});
  }
})

export default router;
