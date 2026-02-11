import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { environment } from './config/environment';
import { logger } from './utils/logger';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes will be added here later
// app.use('/api/auth', authRoutes);
// app.use('/api/students', studentRoutes);

app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

const port = environment.port;

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

export default app;