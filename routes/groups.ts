// userRoute.ts
import express from 'express';
import WebSocket from 'ws';
import { authenticate } from '../middleware/auth/authenticate.js';
import { createGroup, deleteUser } from '../controles/Group.js';
import { valGroup } from '../middleware/validation/valGroup.js';
import { User } from '../DB/entities/User.js';
import { Groups } from '../DB/entities/Groups.js';
import { Group_chats } from '../DB/entities/Group_chats.js';
import { Contact } from '../DB/entities/Contact.js';

const router = express.Router();
// create group
router.post('/' , authenticate , valGroup , (req , res , next) =>{
    const userId = res.locals.user.id;
      createGroup(req.body.groupName , userId).then((result) => {
        res.status(200).send(result);
      }).catch((err) => {
        next({ error: err });
      });
})

router.put('/edit/name' , authenticate , async (req , res , next) =>{
  try {
    const recognizedKeys = ['groupName'];
    const userId = res.locals.user.id
    const { group_name, Group_id } = req.body;

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
    const userId1 = res.locals.user.id
    const { groupId, userId2 , secondOwner} = req.body;
    const group = await Groups.findOneBy({ id: groupId });
    const user1 = await User.findOneBy({ id: userId1 });
    const user2 = await User.findOneBy({ id: userId2 });

    if (!group || !user1 || !user2) {
      return next({ error: `Group or user1 or user2 is not found from delete/user` });
    }
    else {
      const contact = await Contact.findOneBy({ id : userId2 });
      if(contact){
      if(user1.id === group.created_by){
        if(user2.id == user1.id){
          const second = group.Admin.find((user) => user.id === secondOwner);
          if(second){
            group.created_by = secondOwner;
            await deleteUser(group , contact).then(() => {
              res.status(200).send(" user Delete from group");
            }).catch((err) => {
              next({ error : err });
            }); 
          }
          else{
            res.status(400).send("Cant delete owner if there is no replace")
          }
        } 
        else{
          await deleteUser(group , contact).then(() => {
            res.status(200).send(" user Delete from group");
          }).catch((err) => {
            next({ error : err });
          }); 
        }
      }
    
        
      //user want to delete him self from the group
      if (user1.id === user2.id) {
        // Check if user1 and user2 are the same user
        await deleteUser(group , contact).then(() => {
          res.status(200).send(" user Delete from group");
        }).catch((err) => {
          next({ error : err });
        }); 
      } 
      else{
        const Admin1 = group.Admin.filter((user) => user1 === user);
        const Admin2 = group.Admin.filter((user) => user2 === user);
        if(Admin1 && !Admin2){
          await deleteUser(group , contact).then(() => {
            res.status(200).send(" user Delete from group");
          }).catch((err) => {
            next({ error : err });
          }); 
        }
      }
      res.status(500).send("User still in the group");
    }
  }
    
  } catch (err) {
    next({ error: err });
  }
});

router.post('/addAdmin' , authenticate , async (req , res , next) => {
  try{
      const userId = res.locals.user.id
      const {adminId , groupId} = req.body;
      const person = await User.findOneBy({ id: userId });
      const group = await Groups.findOneBy({ id: groupId });
      if(!group || !person){
        next({ error: `group not found or user not found from /add/admin `});
      }
      const admin = group?.Admin.find((user) => user.id === adminId);
      if(!admin){
        next({ error: `Admin not found from /add/admin`});
      }
      const user = group?.Group_id.user.find((user) => user.id === userId);
      if(!user && person){
        group?.Group_id.user.push(person);
        await group?.Group_id.save();
      }
      if(person)
        group?.Admin.push(person);
      await group?.save();
      res.status(200).send("User add ");

  }catch(err){
    next({error: err})
  }
})

router.delete('/', authenticate, async (req, res, next) => {
  try {
    const userId = res.locals.user.id
    const { Group_id } = req.body;
    const group = await Groups.findOneBy({ id: Group_id });

    if (!group) {
      return next({ error: 'Group not found in group/delete' });
    }

    if (group && group.created_by === userId) {
      await Groups.remove(group);
      res.status(200).send('Group Deleted');
    } else {
      res.status(500).send('Unauthorized');
    }
  } catch (err) {
    next({ error: err });
  }
});

//search messages in group chats
router.get('/', authenticate, async (req, res, next) => {
  try {
    const groupId = req.query.groupId as string;
    const text = req.query.text as string;  

    if(!groupId || !text){
      return res.status(400).json({ error: 'Both chat_Text and userId are required query parameters' });
    }

    const group = await Groups.findOneBy({ id: groupId });

    if (group) {

      const filteredMessages = group.group_chats.filter((item) => item.chat_text.toLowerCase().includes(text.toLowerCase()));
      if(!filteredMessages){
        return res.status(404).json({ message: 'No matching chat messages found' });
      }
      res.status(200).json(filteredMessages);
    } else {
      res.status(404).json({ error: 'Group not found' });
    }
  } catch (err) {
    next({ error: err });
  }
});


export default router;
