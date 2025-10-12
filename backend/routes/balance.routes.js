import express from 'express';
import { authenticate, requireRoles } from '../middleware/auth.middleware.js';
import {  calculateBalances, debugData, getBalanceSummary, setOpeningBalance } from '../controllers/balance.controller.js';

const balancesRouter = express.Router();

balancesRouter.use(authenticate);

// Calculate balances for a specific period
balancesRouter.post('/calculate', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), calculateBalances);

// Get balance summary for dashboard
balancesRouter.get('/summary', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), getBalanceSummary);

// Set opening balance
balancesRouter.post('/opening-balance', requireRoles(['Admin', 'BaseCommander']), setOpeningBalance);

balancesRouter.get('/debug', requireRoles(['Admin']), debugData);


export default balancesRouter ;
