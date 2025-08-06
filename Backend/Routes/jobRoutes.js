import express from 'express'
import {authenticate} from '../Middlewares/authMiddleware.js'

import { createJob } from '../Controllers/jobControllers.js';

const router=express.Router();

router.route('/').post(authenticate,createJob)

export default router;