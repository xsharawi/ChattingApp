import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import  dataSource from '../DB/dataSource.js';
import { Chat } from '../DB/entities/Chat.js';
import { Group_chats } from '../DB/entities/Group_chats.js';

const insertChat = (playload: Chat) =>{
    return dataSource.manager.transaction(async transaction => {
        const newChat = Chat.create({
            ...playload
        });
        await transaction.save(newChat);
    })
}
const insertChatGroup = (playload: Group_chats) =>{
    return dataSource.manager.transaction(async transaction => {
        const newChat = Group_chats.create({
            ...playload
        });
        await transaction.save(newChat);
    })
}

export {
    insertChat,
    insertChatGroup
}