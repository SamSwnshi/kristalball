import express from "express";
import { authenticate, requireRoles } from "../middleware/auth.middleware.js";
import { createAssignment, createExpenditure, getAssignmentsAndExpenditures } from "../controllers/assignmentController.controller.js";

const assignmentsRouter = express.Router();

assignmentsRouter.use(authenticate);


assignmentsRouter.post(
  "/assign",
  requireRoles(["Admin", "BaseCommander"]),
  createAssignment
);


assignmentsRouter.post(
  "/expend",
  requireRoles(["Admin", "BaseCommander"]),
  createExpenditure
);


assignmentsRouter.get(
  "/",
  requireRoles(["Admin", "BaseCommander"]),
  getAssignmentsAndExpenditures
);

export default assignmentsRouter ;
