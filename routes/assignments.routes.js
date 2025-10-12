import express from "express";
import { authenticate, requireRoles } from "../middleware/auth.middleware.js";
import { createAssignment, createExpenditure, getAssignmentsAndExpenditures } from "../controllers/assignmentController.controller.js";

const assignmentsRouter = express.Router();

assignmentsRouter.use(authenticate);

// Assign assets
assignmentsRouter.post(
  "/assign",
  requireRoles(["Admin", "BaseCommander", "LogisticsOfficer"]),
  createAssignment
);

// Record expenditure
assignmentsRouter.post(
  "/expend",
  requireRoles(["Admin", "BaseCommander", "LogisticsOfficer"]),
  createExpenditure
);

// List assignments and expenditures
assignmentsRouter.get(
  "/",
  requireRoles(["Admin", "BaseCommander", "LogisticsOfficer"]),
  getAssignmentsAndExpenditures
);

export default assignmentsRouter ;
