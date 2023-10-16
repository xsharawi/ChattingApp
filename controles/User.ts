import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../DB/entities/User.js';
import  dataSource from '../DB/dataSource.js';

const insertUser = (playload: User) =>{
    return dataSource.manager.transaction(async transaction => {
        const newUser = User.create({
            ...playload
        });
        await transaction.save(newUser);
    })
}