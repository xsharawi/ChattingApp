// userRoute.ts
import express from 'express';
import WebSocket from 'ws';
import { authenticate } from '../middleware/auth/authenticate.js';

import { User } from '../DB/entities/User.js';
import { Contact } from '../DB/entities/Contact.js';
import { Groups } from '../DB/entities/Groups.js';
const router = express.Router();

router.get('/contacts/:userId', authenticate, async (req, res, next) => {
  try {
    const userId = res.locals.user.id;
    const user = await Contact.findOneBy({ id: userId });
    
    if (!user) {
      return next({ error: 'User not found in contact/contacts' });
    }
    let contact = user.contacts;
    res.status(200).send(contact);
  } catch (err) {
    next({ error: err });
  }
});

router.post('/add' , authenticate , async (req , res , next) => {
  try{
    const userId = res.locals.user.id;
    const{userId2} = req.body;
    const contact = await Contact.findOneBy({ id: userId });
    const user2 = await User.findOneBy({ id: userId2 }) || await Groups.findOneBy({ id : userId2});
    if(!contact || !user2){
      next({ error : `User not found in contact/add`});
    }
    if(user2)
      contact?.contacts.push(user2.id);
    await contact?.save();
  }catch(err){
    next({error: err})
  }
})

router.delete('/delete' , authenticate , async (req , res , next) =>{
  try{
      const userId = res.locals.user.id;
      const { user2 } = req.body
      const contact = await Contact.findOneBy({ id : userId });
      
      if(!contact)
        next({error : `no user in contact/delete`});
      if(contact){
        const cont = contact.contacts.filter((id) => id !== user2);
        const block = contact.blockcontact.filter((id) => id !== user2);
        const mute = contact.mutecontact.filter((id) => id !== user2);
        contact.contacts = cont;  
        contact.blockcontact = block;
        contact.mutecontact = mute;
        await contact.save()
        res.status(200).send("its deleted")
      }
      
  }catch(err){
    next({ error : err });
  }
})

router.put('/block' , authenticate , async(req , res , next) =>{
  try{
      const userId = res.locals.user.id;
      const {user2} = req.body;

      const contact = await Contact.findOneBy({ id : userId })
      const blockUser = await User.findOneBy({ id : user2 });
      if(!contact || !blockUser){
        next({error: `user sender or user Block is not find from contact/block`});
      }
      else{
        const cont = contact.contacts.filter((id) => id !== user2);
        contact.contacts = cont;
        contact.blockcontact.push(user2);
        await contact.save();
        res.status(200).send(`user blocked `);
      }
  }catch(err){
    next({ error : err })
  }
})

router.put('/mute' , authenticate , async(req , res , next) =>{
  try{
      const userId = res.locals.user.id;
      const {user2} = req.body;

      const contact = await Contact.findOneBy({ id : userId })
      
      const muteUser = await User.findOneBy({ id : user2 }) || await Groups.findOneBy({ id : user2});
      if(!contact || !muteUser){
        next({error: `user sender or user Mute is not find from contact/mute`});
      }
      else{
        const cont = contact.contacts.filter((id) => id !== user2);
        contact.contacts = cont;
        contact.mutecontact.push(user2);
        await contact.save();
        res.status(200).send(`user Mute `);
      }
  }catch(err){
    next({ error : err })
  }
})

router.put('/unblock' , authenticate , async(req , res , next) =>{
  try{
      const userId = res.locals.user.id;
      const {user2} = req.body;
      const contact = await Contact.findOneBy({ id : userId });
      const blockUser = await User.findOneBy({ id : user2 });
      if(!contact || !blockUser){
        next({error: `user sender or user Block is not find from contact/block`});
      }
      else{
        const block = contact.blockcontact.filter((id) => id !== user2);
        contact.blockcontact = block;
        contact.contacts.push(user2);

        await contact.save();
        res.status(200).send(`user unBlocked `);
      }
  }catch(err){
    next({ error : err })
  }
})

router.put('/unmute' , authenticate , async(req , res , next) =>{
  try{
      const userId = res.locals.user.id;
      const {user2} = req.body;
      const contact = await Contact.findOneBy({ id : userId });
      const muteUser = await User.findOneBy({ id : user2 }) || await Groups.findOneBy({ id : user2});
      if(!contact || !muteUser){
        next({error: `user sender or user Mute is not find from contact/mute`});
      }
      else{
        const mute = contact.mutecontact.filter((id) => id !== user2);
        contact.mutecontact = mute;
        contact.contacts.push(user2);
        await contact.save();
        res.status(200).send(`user unMuted `);
      }
  }catch(err){
    next({ error : err })
  }
})
export default router;
