import express from 'express';
import { authController } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/login', authController.login);
authRouter.post('/signup', authController.signup);
authRouter.post('/logout', authController.logout);
authRouter.post('/setup-bases', authController.setupBases);

export { authRouter };


