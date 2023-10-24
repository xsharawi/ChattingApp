// userRoute.ts
import express from 'express';
import WebSocket from 'ws';
import { authenticate } from '../middleware/auth/authenticate.js';
import { createGroup } from '../controles/Group.js';
import { valGroup } from '../middleware/validation/valGroup.js';
import { User } from '../DB/entities/User.js';
import { Groups } from '../DB/entities/Groups.js';
import { group } from 'console';

const router = express.Router();

router.post('/add' , authenticate , valGroup , (req , res , next) =>{
      createGroup(req.body.groupName , req.body.userId).then((result) => {
        res.status(200).send(result);
      }).catch((err) => {
        next({ error: err });
      });
})

router.put('/edit/name' , authenticate , async (req , res , next) =>{
  try {
    const recognizedKeys = ['group_name'];
    const { userId, group_name, Group_id } = req.body;

    let user = await User.findOneBy({ id: userId });
    let group = await Groups.findOneBy( {id : Group_id });
    if(user && group)
    if(group?.Admin.includes(user) && group_name.length > 5){
      group.group_name = group_name;
      await group.save();
      res.status(200).send({message: "Group name changer", group});
    }
    else {
      return next({ error: 'User not found or Group not Found or Group Name is smaller than 6' });
    } 
  } catch (err) {
    next({ error: err });
  }
})

router.delete('/delete/user', authenticate, async (req, res, next) => {
  try {
    const { userId1, groupId, userId2 } = req.body;
    const group = await Groups.findOneBy({ id: groupId });
    const user1 = await User.findOneBy({ id: userId1 });
    const user2 = await User.findOneBy({ id: userId2 });

    if (!group || !user1 || !user2) {
      return next({ error: `Group or user1 or user2 is not found from delete/user` });
    }
    //user want to delete him self from the group
    if (user1.id === user2.id) {
      // Check if user1 and user2 are the same user
      const Group_members = group.Group_id;
      const filteredUsers = Group_members.user.filter((user) => user.id !== user2.id);
      Group_members.user = filteredUsers;
      await Group_members.save();
      res.status(200).send('User removed from the group');
    } 
    else{
      const Admin1 = group.Admin.filter((user) => user1 === user);
      const Admin2 = group.Admin.filter((user) => user2 === user);
      if(Admin1 && !Admin2){
        const Group_members = group.Group_id;
        const filteredUsers = Group_members.user.filter((user) => user.id !== user2.id);
        Group_members.user = filteredUsers;
        await Group_members.save();
        res.status(200).send('User removed from the group');
      }
    }
    res.status(500).send("User still in the group");
  } catch (err) {
    next({ error: err });
  }
});



export default router;
