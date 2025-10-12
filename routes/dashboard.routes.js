import express from 'express';
import { authenticate, requireRoles } from '../middleware/auth.middleware.js';
import { getDetailedMovement, getMetrics } from '../controllers/dashboard.controller.js';

const dashboardRouter = express.Router();

dashboardRouter.use(authenticate);

dashboardRouter.get('/', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), getMetrics);
dashboardRouter.get(
  "/detailed-movement",
  requireRoles(["Admin", "BaseCommander", "LogisticsOfficer"]),
  getDetailedMovement
);

export default dashboardRouter ;


