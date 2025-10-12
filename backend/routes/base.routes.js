import express from 'express'
import { createBase, createEquipment, createEquipmentType, createRole, getBases, getEquipment, getEquipmentTypes, getRoles } from '../controllers/base.controller.js'
import {authenticate, requireRoles} from '../middleware/auth.middleware.js'
const baseRouter = express.Router()

baseRouter.get('/public/roles', getRoles);
baseRouter.get('/public/bases', getBases);

baseRouter.use(authenticate);

// Get all bases
baseRouter.get(
  "/bases",
  requireRoles(["Admin", "BaseCommander", "LogisticsOfficer"]),
  getBases
);

// Get all equipment
baseRouter.get(
  "/equipment",
  requireRoles(["Admin", "BaseCommander", "LogisticsOfficer"]),
  getEquipment
);

// Get all equipment types
baseRouter.get(
  "/equipment-types",
  requireRoles(["Admin", "BaseCommander", "LogisticsOfficer"]),
  getEquipmentTypes
);

// Get all roles
baseRouter.get(
  "/roles",
  requireRoles(["Admin", "BaseCommander", "LogisticsOfficer"]),
  getRoles
);

// Create equipment type
baseRouter.post(
  "/equipment-types",
  requireRoles(["Admin"]),
  createEquipmentType
);

// Create equipment
baseRouter.post(
  "/equipment",
  requireRoles(["Admin"]),
  createEquipment
);

// Create base
baseRouter.post("/bases", requireRoles(["Admin"]), createBase);

// Create role
baseRouter.post("/roles", requireRoles(["Admin"]), createRole);


export default baseRouter;