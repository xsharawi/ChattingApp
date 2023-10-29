// userRoute.ts
import express from 'express';
import WebSocket from 'ws';
import { authenticate } from '../middleware/auth/authenticate.js';

import { User } from '../DB/entities/User.js';
const router = express.Router();

router.get('/contacts/:userId', authenticate, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOneBy({ id: userId });
    
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
    const user = await User.findOneBy({ id: userId });
    const user2 = await User.findOneBy({ id: userId2 });
    if(!user || !user2){
      next({ error : `User not found in contact/add`});
    }
    if(user2)
      user?.contacts.push(user2.id);
    await user?.save();
  }catch(err){
    next({error: err})
  }
})

router.delete('/delete' , authenticate , async (req , res , next) =>{
  try{
      const userId = res.locals.user.id;
      const { user2 } = req.body
      const user = await User.findOneBy({ id : userId });
      if(!user)
        next({error : `no user in contact/delete`});
      if(user){
        const cont = user.contacts.filter((id) => id !== user2);
        const block = user.blockcontact.filter((id) => id !== user2);
        const mute = user.mutecontact.filter((id) => id !== user2);
        user.contacts = cont;  
        user.blockcontact = block;
        user.mutecontact = mute;
        await user.save()
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
      const user = await User.findOneBy({ id : userId });
      const blockUser = await User.findOneBy({ id : user2 });
      if(!user || !blockUser){
        next({error: `user sender or user Block is not find from contact/block`});
      }
      else{
        const cont = user.contacts.filter((id) => id !== user2);
        user.contacts = cont;
        user.blockcontact.push(user2);
        await user.save();
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
      const user = await User.findOneBy({ id : userId });
      const muteUser = await User.findOneBy({ id : user2 });
      if(!user || !muteUser){
        next({error: `user sender or user Mute is not find from contact/mute`});
      }
      else{
        const cont = user.contacts.filter((id) => id !== user2);
        user.contacts = cont;
        user.mutecontact.push(user2);
        await user.save();
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
      const user = await User.findOneBy({ id : userId });
      const blockUser = await User.findOneBy({ id : user2 });
      if(!user || !blockUser){
        next({error: `user sender or user Block is not find from contact/block`});
      }
      else{
        const block = user.blockcontact.filter((id) => id !== user2);
        user.blockcontact = block;
        user.contacts.push(user2);

        await user.save();
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
      const user = await User.findOneBy({ id : userId });
      const muteUser = await User.findOneBy({ id : user2 });
      if(!user || !muteUser){
        next({error: `user sender or user Mute is not find from contact/mute`});
      }
      else{
        const mute = user.mutecontact.filter((id) => id !== user2);
        user.mutecontact = mute;
        user.contacts.push(user2);
        await user.save();
        res.status(200).send(`user unMuted `);
      }
  }catch(err){
    next({ error : err })
  }
})
export default router;
