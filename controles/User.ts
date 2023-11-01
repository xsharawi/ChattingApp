import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../DB/entities/User.js';
import  dataSource from '../DB/dataSource.js';
import { Contact } from '../DB/entities/Contact.js';
import nodemailer from 'nodemailer'
import AWS from 'aws-sdk';

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


// Configure AWS credentials
// sharwai change it as it should
AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'us-east-1', // Replace with your preferred AWS region
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// Function to send the activation email
const sendActivationEmail = (email: string, activationLink: string) => {
  // Compose the email parameters
  const params: AWS.SES.SendEmailRequest = {
    Destination: {
      ToAddresses: [email], // Recipient's email address
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
            <p>Click the button below to activate your account:</p>
            <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none;">Activate Account</a>
          `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Account Activation',
      },
    },
    Source: 'chatapp356@gmail.com', // Sender's email address
  };

  // Send the email
  ses.sendEmail(params, (err, data) => {
    if (err) {
      console.error('Error sending activation email:', err);
    } else {
      console.log('Activation email sent successfully:', data.MessageId);
    }
  });
};


export {
    insertUser,
    login,
    sendActivationEmail
}
  
  