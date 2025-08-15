import express from 'express'
import {authenticate} from '../Middlewares/authMiddleware.js'

import { createJob,updateJob,
    deleteJob,getAllJobs
} from '../Controllers/jobControllers.js';
import { getJobByMonth,getJobStatus,avgTimeBtwnStages,getConversionRate} from '../Controllers/jobStatsController.js';
const router=express.Router();

router.route('/').post(authenticate,createJob)
router.route('/:id').put(authenticate,updateJob)
                    .delete(authenticate,deleteJob)
router.route('/stats/status').get(authenticate,getJobStatus)
router.route('/stats/month').get(authenticate,getJobByMonth)
router.route('/stats/avgTime').get(authenticate,avgTimeBtwnStages)
router.route('/stats/conversion-rate').get(authenticate,getConversionRate)
router.route('/getalljobs').get(authenticate,getAllJobs)
export default router;