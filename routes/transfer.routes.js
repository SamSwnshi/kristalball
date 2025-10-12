import express from 'express';
import { authenticate, requireRoles } from '../middleware/auth.middleware.js';
import { createTransfer, getTransfers } from '../controllers/transfer.controller.js';

const transfersRouter = express.Router();

transfersRouter.use(authenticate);

// Create transfer
transfersRouter.post('/', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), createTransfer);

// List transfers
transfersRouter.get('/get', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), getTransfers);

export default transfersRouter ;


