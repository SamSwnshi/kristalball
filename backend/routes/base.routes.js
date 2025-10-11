import express from 'express'
import { getBases, getRoles } from '../controllers/base.controller.js'

const baseRouter = express.Router()

baseRouter.get('/public/roles', getRoles);
baseRouter.get('/public/bases', getBases);

export default baseRouter;