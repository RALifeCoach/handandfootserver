import express from 'express';
import UserController from '../controllers/userController';

const router = express.Router();

router.route('/users', UserController.users);
router.route('/logout', UserController.logout);

export default router;