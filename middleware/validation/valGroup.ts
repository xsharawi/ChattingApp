import { error } from 'console';
import express from 'express';
import isEmail from 'validator/lib/isEmail.js';
import { User } from '../../DB/entities/User.js';
import { Chat } from '../../DB/entities/Chat.js';



const valGroup = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) =>{
    const values = ['groupName'];
    const group = req.body;
    const errorList = values.map(key => !group[key] && `${key} is Required!`).filter(Boolean);

    
    if(errorList.length){
        next({
            error: errorList
        })
    }
    if (group.groupName.length < 5) {
        errorList.push('Group Name should contain at least 5 characters!');
    }
    else {
        next();
    }
}


export {
    valGroup
}