import express from "express";
import { login, logout, setupBases, signUp } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/register", signUp);
authRouter.post('/setup-bases', setupBases);

export default authRouter
