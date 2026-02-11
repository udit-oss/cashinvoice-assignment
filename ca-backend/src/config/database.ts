import { Pool } from 'pg';
import { environment } from '../config/environment';
import { logger } from '../utils/logger';

const pool = new Pool({
    host: environment.dbHost,
    port: environment.dbPort,
    database: environment.dbName,
    user: environment.dbUser,
    password: environment.dbPassword,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
    logger.info('Connected to the PostgreSQL database');
});

pool.on('error', (error) => {
    logger.error(`Unexpected error on idle client: ${error.message}`);
    process.exit(-1);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug(`Executed query in ${duration}ms: ${text}`);
    return result;
  } catch (error: any) {
    logger.error(`Query error: ${error.message}`);
    throw error;
  }
};

export default { query };