import express from 'express';
import { authenticate, requireRoles } from '../middleware/auth.js';
import { transferController } from '../controllers/transferController.js';

const transfersRouter = express.Router();

transfersRouter.use(authenticate);

// Create transfer
transfersRouter.post('/', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), transferController.createTransfer);

// List transfers
transfersRouter.get('/', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), transferController.getTransfers);

export { transfersRouter };


