import express from 'express'
import { createBase, createEquipment, createEquipmentType, createRole, getBases, getEquipment, getEquipmentTypes, getRoles } from '../controllers/base.controller.js'
import {authenticate, requireRoles} from '../middleware/auth.middleware.js'
const baseRouter = express.Router()

baseRouter.get('/public/roles', getRoles);
baseRouter.get('/public/bases', getBases);

baseRouter.use(authenticate);


baseRouter.get(
  "/bases",
  requireRoles(["Admin", "BaseCommander"]),
  getBases
);


baseRouter.get(
  "/equipment",
  requireRoles(["Admin", "BaseCommander", "LogisticsOfficer"]),
  getEquipment
);


baseRouter.get(
  "/equipment-types",
  requireRoles(["Admin", "BaseCommander", "LogisticsOfficer"]),
  getEquipmentTypes
);


baseRouter.get(
  "/roles",
  requireRoles(["Admin"]),
  getRoles
);


baseRouter.post(
  "/equipment-types",
  requireRoles(["Admin"]),
  createEquipmentType
);


baseRouter.post(
  "/equipment",
  requireRoles(["Admin"]),
  createEquipment
);

baseRouter.post("/bases", requireRoles(["Admin"]), createBase);


baseRouter.post("/roles", requireRoles(["Admin"]), createRole);


export default baseRouter;