// userRoute.ts
import express from 'express';
import WebSocket from 'ws';
import { authenticate } from '../middleware/auth/authenticate.js';
import { createGroup } from '../controles/Group.js';
import { valGroup } from '../middleware/validation/valGroup.js';

const router = express.Router();

router.post('/add' , authenticate , valGroup , (req , res , next) =>{
      createGroup(req.body.groupName , req.body.userId).then((result) => {
        res.status(200).send(result);
      }).catch((err) => {
        next({ error: err });
      });
})


export default router;
