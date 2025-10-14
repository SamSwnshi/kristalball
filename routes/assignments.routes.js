import express from "express";
import { authenticate, requireRoles } from "../middleware/auth.middleware.js";
import { createAssignment, createExpenditure, getAssignmentsAndExpenditures } from "../controllers/assignmentController.controller.js";

const assignmentsRouter = express.Router();

assignmentsRouter.use(authenticate);


assignmentsRouter.post(
  "/assign",
  requireRoles(["Admin", "BaseCommander", "LogisticsOfficer"]),
  createAssignment
);


assignmentsRouter.post(
  "/expend",
  requireRoles(["Admin", "BaseCommander", "LogisticsOfficer"]),
  createExpenditure
);


assignmentsRouter.get(
  "/",
  requireRoles(["Admin", "BaseCommander", "LogisticsOfficer"]),
  getAssignmentsAndExpenditures
);

export default assignmentsRouter ;
