import express from 'express';
import protect from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import {
  getUsers,
  updateUser,
  resetUserQuota,
  getStats,
  deleteUser
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users/:id/reset-quota', resetUserQuota);
router.get('/stats', getStats);

export default router;