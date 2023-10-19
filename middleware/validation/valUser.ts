import { error } from 'console';
import express from 'express';
import isEmail from 'validator/lib/isEmail.js';
import { User } from '../../DB/entities/User.js';
import { Chat } from '../../DB/entities/Chat.js';

const postUser = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) =>{
    const values = ['fullName', 'email', 'password', 'type'];
    const user = req.body;
    const errorList = values.map(key => !user[key] && `${key} is Required!`).filter(Boolean);
    
    if (!isEmail.default(user.email)) {
        errorList.push('Email is not Valid');
    }
    if (user.password.length < 6) {
        errorList.push('Password should contain at least 6 characters!');
    }
    if(errorList.length){
        next({
            error: errorList
        })
    }
    else {
        next();
    }
}
//Delete message not from group from direct message
 const valDeleteMsg = async(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
    ) =>{
    const chat_id = req.body.msgid;
    const sender = req.body.sender_id || "don't";
    const chat = await Chat.findOneBy({chat_id});

    if(chat?.sender_id == sender){
        next();
    }
    next({
        error: "sender_id and msg_sender are not the same"
    })

}


export {
    postUser,
    valDeleteMsg
}