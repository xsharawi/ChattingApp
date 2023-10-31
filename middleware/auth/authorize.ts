import express from 'express'
import { Chat } from '../../DB/entities/Chat.js';
import { Groups } from '../../DB/entities/Groups.js';
//Admin or chat (text owner) delete


const valDeleteMsg =async(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) =>{
    const chat_id = req.body.msgid;
    const sender_id = req.body.sender_id || "";
    const receiver_id = req.body.receiver_id || "";
    const chat = await Chat.findOneBy({chat_id});
    const group = await Groups.findOneBy({id: receiver_id})
    const size =  group?.Admin.length || 0;
    let arr = false;
    for(let i = 0; i < size; i++){
        if(sender_id == group?.Admin[i].id){
            arr = true;
        }
    }

    //either it came from the admin of the group or it came from the owner(sender) of the message 
    if(chat?.sender_id == sender_id || arr){
        next();
    }
    next({error: "premission denied to delete message"});
}
export {
    valDeleteMsg
}