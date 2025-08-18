import express from 'express'
import { authenticate } from '../Middlewares/authMiddleware.js'
import { authorize } from '../Middlewares/authorize.js'
import { getAllUsers,getUserById,updateUser,deleteUser} from '../Controllers/adminUserController.js';
import { getAllJobsAdmin,deleteJobAdmin} from '../Controllers/adminJobController.js';
import { getAdminStats,getJobsByMonth,getConversionsRates,getAvgDaysPairs } from '../Controllers/adminAnalyticController.js';
const router=express.Router();

router.use(authenticate,authorize)

//Users
router.route("/users").get(getAllUsers)
router.route("/users/:id").get(getUserById)
                          .put(updateUser)
                          .delete(deleteUser)

//Jobs
router.route("/jobs").post(getAllJobsAdmin);
router.route("/jobs/:id").delete(deleteJobAdmin);

//Analytics
router.route('/analytics/stats').get(getAdminStats)
router.route('/analytics/jobs-by-month').get(getJobsByMonth)
router.route('/analytics/conversions').get(getConversionsRates)
router.route('/analytics/avg-days').get(getAvgDaysPairs)
export default router;
