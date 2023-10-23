// userRoute.ts
import express from 'express';
import WebSocket from 'ws';
import { authenticate } from '../middleware/auth/authenticate.js';
import { createGroup } from '../controles/Group.js';
import { valGroup } from '../middleware/validation/valGroup.js';
import { User } from '../DB/entities/User.js';
import { Groups } from '../DB/entities/Groups.js';

const router = express.Router();

router.post('/add' , authenticate , valGroup , (req , res , next) =>{
      createGroup(req.body.groupName , req.body.userId).then((result) => {
        res.status(200).send(result);
      }).catch((err) => {
        next({ error: err });
      });
})

router.post('/edit' , authenticate , async (req , res , next) =>{
  try {
    const recognizedKeys = ['group_name'];
    const { userId, group_name, Group_id } = req.body;

    let user = await User.findOneBy({ id: userId });
    let group = await Groups.findOneBy( {id : Group_id });
    if(user && group)
    if(group?.Admin.includes(user) && group_name.length > 5){
      group.group_name = group_name;
      await group.save();
      res.status(200).send({"Group name changer" , group});
    }
    else {
      return next({ error: 'User not found or Group not Found or Group Name is smaller than 6' });
    } 
  } catch (err) {
    next({ error: err });
  }
})


export default router;
