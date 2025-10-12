import express from 'express';
import { authenticate, requireRoles } from '../middleware/auth.js';
import { dashboardController } from '../controllers/dashboardController.js';

const dashboardRouter = express.Router();

dashboardRouter.use(authenticate);

dashboardRouter.get('/', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), dashboardController.getMetrics);

// Get detailed movement breakdown for pop-up display
dashboardRouter.get('/detailed-movement', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), dashboardController.getDetailedMovement);

export { dashboardRouter };


