import { Router } from 'express';
import { getAllAttendance, getStats } from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Protect all admin routes
router.use(authenticate);
router.use(authorize(['ADMIN']));

router.get('/attendance', getAllAttendance);
router.get('/stats', getStats);

export default router;
