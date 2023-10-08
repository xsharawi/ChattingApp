import express from 'express'
import os from 'os'
import 'dotenv/config'
import * as db from "./DB/dataSource.js"

const PORT = process.env.PORT
const HOST = os.hostname();

const app = express()




app.listen(PORT,()=>{
    console.log(`SERVER RUNNING ON http://${HOST}:${PORT}`)
    db.init()
})