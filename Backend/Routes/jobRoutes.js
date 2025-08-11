import express from 'express'
import {authenticate} from '../Middlewares/authMiddleware.js'

import { createJob,updateJob,getJobStatus,getJobByMonth,
    deleteJob,getAllJobs
} from '../Controllers/jobControllers.js';

const router=express.Router();

router.route('/').post(authenticate,createJob)
router.route('/:id').put(authenticate,updateJob)
                    .delete(authenticate,deleteJob)
router.route('/stats/status').get(authenticate,getJobStatus)
router.route('/stats/month').get(authenticate,getJobByMonth)
router.route('/getalljobs').get(authenticate,getAllJobs)
export default router;