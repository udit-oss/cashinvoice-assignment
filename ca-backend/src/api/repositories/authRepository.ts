import { logger } from '../../utils/logger';
import { User } from '../../types';
import { query } from '../../config/database';
import { AuthQueries } from '../../enums/pgQueriesEnum';

const authRepository = {
    getUserByEmail: async (email: string): Promise<User | null> => {
        try {
            const _query = {
                text: AuthQueries.GET_USER_BY_EMAIL,
                values: [email]
            }
            logger.debug(`Executing query: ${_query.text} with values: ${_query.values}`);

            const result = await query(_query.text, _query.values);

            logger.debug(`Query result: ${JSON.stringify(result.rows)}`);

            return result.rows.length > 0 ? result.rows[0] : null;
        }
        catch (error: any) {
            logger.error(`Error in getUserByEmail: ${error.message}`);
            throw error;
        }
    }
}

export default authRepository;