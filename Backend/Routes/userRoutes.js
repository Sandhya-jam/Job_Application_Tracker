import express from 'express'

import { createUser,loginUser,logoutUser,
getProfile,updateProfile} from '../Controllers/userControllers.js';
import { authenticate } from '../Middlewares/authMiddleware.js';

const router=express.Router()

router.route('/').post(createUser);
router.route('/auth').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/profile')
      .get(authenticate,getProfile)
      .put(authenticate,updateProfile)
export default router;