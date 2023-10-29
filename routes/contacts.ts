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


export default router;
