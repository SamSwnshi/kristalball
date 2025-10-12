import express from 'express';
import { authenticate, requireRoles } from '../middleware/auth.js';
import { assignmentController } from '../controllers/assignmentController.js';

const assignmentsRouter = express.Router();

assignmentsRouter.use(authenticate);

// Assign assets
assignmentsRouter.post('/assign', requireRoles(['Admin', 'BaseCommander']), assignmentController.createAssignment);

// Record expenditure
assignmentsRouter.post('/expend', requireRoles(['Admin', 'BaseCommander']), assignmentController.createExpenditure);

// List assignments and expenditures
assignmentsRouter.get('/', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), assignmentController.getAssignmentsAndExpenditures);

export { assignmentsRouter };


