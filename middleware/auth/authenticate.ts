import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../DB/entities/User.js';

const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  
  const token = req.headers['authorization'] || '';
  let tokenIsValid;
  try {
    tokenIsValid = jwt.verify(token, process.env.SECRET_KEY || '');
  } catch (err) {
    // Handle the error, but don't send a response here
    return next({ error: err });
  }

  if (tokenIsValid) {
    const decoded = jwt.decode(token, { json: true });
    const user = await User.findOneBy({ email: decoded?.email || '' });

    if (!user) {
      // Handle the error, but don't send a response here
      return next({ error: 'token is not valid' });
    }

    res.locals.user = user;
    return next(); // Continue to the next middleware
  } else {
    res.status(401).send("You are Unauthorized!");
  }
};

export { authenticate };
