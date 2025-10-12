import express from 'express';
import { authenticate, requireRoles } from '../middleware/auth.js';
import { baseController } from '../controllers/baseController.js';

const baseRouter = express.Router();

// Public endpoints (no authentication required)
baseRouter.get('/public/roles', baseController.getRoles);
baseRouter.get('/public/bases', baseController.getBases);

baseRouter.use(authenticate);

// Get all bases
baseRouter.get('/bases', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), baseController.getBases);

// Get all equipment
baseRouter.get('/equipment', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), baseController.getEquipment);

// Get all equipment types
baseRouter.get('/equipment-types', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), baseController.getEquipmentTypes);

// Get all roles
baseRouter.get('/roles', requireRoles(['Admin', 'BaseCommander', 'LogisticsOfficer']), baseController.getRoles);

// Create equipment type
baseRouter.post('/equipment-types', requireRoles(['Admin']), baseController.createEquipmentType);

// Create equipment
baseRouter.post('/equipment', requireRoles(['Admin']), baseController.createEquipment);

// Create base
baseRouter.post('/bases', requireRoles(['Admin']), baseController.createBase);

// Create role
baseRouter.post('/roles', requireRoles(['Admin']), baseController.createRole);

export { baseRouter };
