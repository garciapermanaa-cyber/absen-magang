import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prisma';

export const getAllAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const attendance = await prisma.attendance.findMany({
      include: {
        user: {
          select: {
            email: true,
            role: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all attendance', error });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, presentToday, lateToday] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.attendance.count({ where: { date: today, status: 'PRESENT' } }),
      prisma.attendance.count({ where: { date: today, status: 'LATE' } }),
    ]);

    res.status(200).json({
      totalUsers,
      presentToday,
      lateToday,
      absentToday: totalUsers - (presentToday + lateToday),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error });
  }
};
