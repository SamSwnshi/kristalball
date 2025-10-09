import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import config from './db/config.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 8080;

app.use(express.json())
app.use(cors())

app.listen(port,()=>{
    console.log(`Server is Running in PORT: ${port}`)
    config()
})