import express from 'express';
import { authenticate, requireRoles } from '../middleware/auth.middleware.js';
import {  calculateBalances, debugData, getBalanceSummary, setOpeningBalance } from '../controllers/balance.controller.js';

const balancesRouter = express.Router();

balancesRouter.use(authenticate);


balancesRouter.post('/calculate', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), calculateBalances);


balancesRouter.get('/summary', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), getBalanceSummary);


balancesRouter.post('/opening-balance', requireRoles(['Admin', 'BaseCommander']), setOpeningBalance);

balancesRouter.get('/debug', requireRoles(['Admin']), debugData);


export default balancesRouter ;
