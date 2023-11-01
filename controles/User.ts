import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../DB/entities/User.js';
import  dataSource from '../DB/dataSource.js';
import { Contact } from '../DB/entities/Contact.js';


const insertUser = (playload: User) =>{
    return dataSource.manager.transaction(async transaction => {
        const newUser = User.create({
            ...playload
        });
        await transaction.save(newUser);

        const newContact = Contact.create({
            id: newUser.id
        })
        await transaction.save(newContact);
    })
}

const login = async (email: string, password: string) => {
    try {
      const user = await User.findOneBy({
        email,
      });
      const passwordMatching = await bcrypt.compare(password, user?.password || '');
  
  
      if (user && passwordMatching) {
        const token = jwt.sign(
          {
            email: user.email,
            fullName: user.username
          },
          process.env.SECRET_KEY || '',
          {
            expiresIn: "30m"
          }
        );
  
        return {token , username: user.username};
      } else {
        throw ("Invalid Username or password!");
      }
    } catch (error) {
      throw ("Invalid Username or password!");
    }
}

export {
    insertUser,
    login
}
  
  