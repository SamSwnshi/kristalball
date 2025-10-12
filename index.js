import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import config from './db/config.js'
import authRoutes from './routes/auth.routes.js'
import  purchasesRouter from './routes/purchase.routes.js';
import  transfersRouter from './routes/transfer.routes.js';
import assignmentsRouter from './routes/assignments.routes.js';
import  dashboardRouter from './routes/dashboard.routes.js';
import baseRouter from './routes/base.routes.js';
import balancesRouter from './routes/balance.routes.js'
dotenv.config()
const app = express()
const port = process.env.PORT || 8080;

app.use(express.json())
app.use(cors())

app.use('/api/auth',authRoutes)
app.use('/api/purchases', purchasesRouter);
app.use('/api/transfers', transfersRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/balances', balancesRouter);
app.use('/api', baseRouter);

app.listen(port,()=>{
    console.log(`Server is Running in PORT: ${port}`)
    config()
})