import { Router } from 'express';
import { checkIn, checkOut, getMyAttendance } from '../controllers/attendanceController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/check-in', authenticate, checkIn);
router.post('/check-out', authenticate, checkOut);
router.get('/history', authenticate, getMyAttendance);

export default router;
