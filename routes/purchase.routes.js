import express from 'express';
import { authenticate, requireRoles } from '../middleware/auth.middleware.js';
import { createPurchase, getPurchases } from '../controllers/purchase.controller.js';

const purchasesRouter = express.Router();

purchasesRouter.use(authenticate);

// Create purchase
purchasesRouter.post('/create', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), createPurchase);

// List purchases with filters
purchasesRouter.get('/', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), getPurchases);

export default purchasesRouter ;


