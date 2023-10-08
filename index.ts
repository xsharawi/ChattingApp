import express from 'express'
import os from 'os'
import 'dotenv/config'
import * as db from "./DB/dataSource.js"

import userRoute from './routes/users.js'
import contactRoute from './routes/users.js'
import groupRoute from './routes/users.js'
import chatRoute from './routes/users.js'


const PORT = process.env.PORT
const HOST = os.hostname();

const app = express()

app.use('/users' , userRoute);
app.use('/chats' , contactRoute);
app.use('/groups' , groupRoute);
app.use('/contacts' , contactRoute);



app.listen(PORT,()=>{
    console.log(`SERVER RUNNING ON http://${HOST}:${PORT}`)
    db.init()
})