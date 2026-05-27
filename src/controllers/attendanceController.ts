import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prisma';

// Haversine formula to calculate distance between two points in meters
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const checkIn = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { latitude, longitude, accuracy, cameraVerified } = req.body;

    // Get user and office info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { office: true },
    });

    if (!user || !user.office) {
      return res.status(400).json({ message: 'User or Office not found' });
    }

    // Calculate distance
    const distance = calculateDistance(
      latitude,
      longitude,
      user.office.latitude,
      user.office.longitude
    );

    const isLocationValid = distance <= user.office.radius;

    if (!isLocationValid) {
      return res.status(400).json({
        message: 'Rejected: Outside office radius',
        distance,
        radius: user.office.radius,
      });
    }

    if (!cameraVerified) {
      return res.status(400).json({ message: 'Camera verification required' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Determine status (e.g., LATE if after 09:00 AM)
    const now = new Date();
    const startTime = new Date(today);
    startTime.setHours(9, 0, 0, 0);
    const status = now > startTime ? 'LATE' : 'PRESENT';

    const attendance = await prisma.attendance.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        clockIn: now,
        latIn: latitude,
        longIn: longitude,
        accuracyIn: accuracy,
        distanceIn: distance,
        locationValidIn: true,
        cameraVerifiedIn: true,
        status,
      },
      create: {
        userId,
        date: today,
        clockIn: now,
        latIn: latitude,
        longIn: longitude,
        accuracyIn: accuracy,
        distanceIn: distance,
        locationValidIn: true,
        cameraVerifiedIn: true,
        status,
      },
    });

    res.status(200).json({ message: 'Check-in successful', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error during check-in', error });
  }
};

export const checkOut = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { latitude, longitude, accuracy, cameraVerified } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { office: true },
    });

    if (!user || !user.office) {
      return res.status(400).json({ message: 'User or Office not found' });
    }

    const distance = calculateDistance(
      latitude,
      longitude,
      user.office.latitude,
      user.office.longitude
    );

    const isLocationValid = distance <= user.office.radius;

    if (!isLocationValid) {
      return res.status(400).json({
        message: 'Rejected: Outside office radius',
        distance,
        radius: user.office.radius,
      });
    }

    if (!cameraVerified) {
      return res.status(400).json({ message: 'Camera verification required' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const now = new Date();
    // Logic for EARLY_CHECKOUT if before 17:00 PM
    const endTime = new Date(today);
    endTime.setHours(17, 0, 0, 0);
    
    // We update the existing attendance record for today
    const attendance = await prisma.attendance.update({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      data: {
        clockOut: now,
        latOut: latitude,
        longOut: longitude,
        accuracyOut: accuracy,
        distanceOut: distance,
        locationValidOut: true,
        cameraVerifiedOut: true,
        // Optionally update status if check-out is early
        status: (await prisma.attendance.findUnique({ where: { userId_date: { userId, date: today } } }))?.status === 'LATE' 
                ? 'LATE' 
                : (now < endTime ? 'EARLY_CHECKOUT' : 'PRESENT')
      },
    });

    res.status(200).json({ message: 'Check-out successful', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error during check-out', error });
  }
};

export const getMyAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const attendance = await prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error });
  }
};
