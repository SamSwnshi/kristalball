import express from 'express';
import { authenticate, requireRoles } from '../middleware/auth.js';
import { balanceController } from '../controllers/balanceController.js';

const balancesRouter = express.Router();

balancesRouter.use(authenticate);

// Calculate balances for a specific period
balancesRouter.post('/calculate', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), balanceController.calculateBalances);

// Get balance summary for dashboard
balancesRouter.get('/summary', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), balanceController.getBalanceSummary);

// Set opening balance
balancesRouter.post('/opening-balance', requireRoles(['Admin', 'BaseCommander']), balanceController.setOpeningBalance);

// Debug endpoint
balancesRouter.get('/debug', requireRoles(['Admin']), balanceController.debugData);

export { balancesRouter };
