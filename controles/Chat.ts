import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import  dataSource from '../DB/dataSource.js';
import { Chat } from '../DB/entities/Chat.js';

const generateRandomKey = (length: number) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*/-=';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
};

const insertChat = (playload: Chat) =>{
    const encryptionKey = generateRandomKey(32);
    return dataSource.manager.transaction(async transaction => {
        const newChat = Chat.create({
            ...playload,
            encryption_key:encryptionKey
        });
        await transaction.save(newChat);
    })
}

export {
    insertChat
}