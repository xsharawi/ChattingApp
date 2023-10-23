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
    const values = ['created_by', 'group_name'];
    const group = req.body;
    const errorList = values.map(key => !group[key] && `${key} is Required!`).filter(Boolean);

    if (group.group_name.length < 5) {
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


export {
    valGroup
}