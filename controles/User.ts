import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../DB/entities/User.js';
import  dataSource from '../DB/dataSource.js';
import { Contact } from '../DB/entities/Contact.js';
import nodemailer from 'nodemailer'

const insertUser = async (playload: object) =>{
    return dataSource.manager.transaction(async transaction => {
        const newUser = User.create({
            ...playload
        });

        const newContact = Contact.create({
            id: newUser.id
        })
        await transaction.save(newContact);
        await transaction.save(newUser);
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

const sendActivationEmail = async (email: string, activationLink: string) => {

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'chatapp356@gmail.com',
      pass: 'helloCHATapp333&%',
    },
  });
  const mailOptions = {
    from: 'chatapp356@gmail.com',
    to: email,
    subject: 'Account Activation',
    html: `
      <p>Click the button below to activate your account:</p>
      <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none;">Activate Account</a>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Activation email sent successfully');
  } catch (error) {
    console.error('Error sending activation email:', error);
  }
}


export {
    insertUser,
    login
}
  
  