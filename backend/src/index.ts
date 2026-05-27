import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import attendanceRoutes from './routes/attendanceRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from Absen Magang Backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
