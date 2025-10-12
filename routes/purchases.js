import express from 'express';
import { authenticate, requireRoles } from '../middleware/auth.js';
import { purchaseController } from '../controllers/purchaseController.js';

const purchasesRouter = express.Router();

purchasesRouter.use(authenticate);

// Create purchase
purchasesRouter.post('/', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), purchaseController.createPurchase);

// List purchases with filters
purchasesRouter.get('/', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), purchaseController.getPurchases);

export { purchasesRouter };


