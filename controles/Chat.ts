import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import  dataSource from '../DB/dataSource.js';
import { Chat } from '../DB/entities/Chat.js';

const insertChat = (playload: Chat) =>{
    return dataSource.manager.transaction(async transaction => {
        const newChat = Chat.create({
            ...playload
        });
        await transaction.save(newChat);
    })
}

export {
    insertChat
}