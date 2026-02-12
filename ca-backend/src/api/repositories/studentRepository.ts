import { logger } from "../../utils/logger";
import { Student } from "../../types";
import { query } from "../../config/database";
import { StudentQueries } from "../../enums/pgQueriesEnum";

const studentRepository = {
    existsByEmail: async (email: String): Promise<boolean> => {
        try {
            const _query = {
                text: StudentQueries.EXISTS_BY_EMAIL,
                values: [email]
            }
            logger.debug(`Executing query: ${_query.text} with values: ${_query.values}`);

            const result = await query(_query.text, _query.values);

            logger.debug(`Query result: ${JSON.stringify(result.rows)}`);
            return result.rows[0].exists;
        }
        catch (error: any) {
            logger.error(`Error in existsByEmail: ${error.message}`);
            throw error;
        }
    },
    createStudent: async (student: Student): Promise<Student> => {
        try {
            const _query = {
                text: StudentQueries.CREATE,
                values: [student.name, student.email, student.age, student.course, student.status, student.created_by]
            }
            const result = await query(_query.text, _query.values);
            logger.debug(`Query result: ${JSON.stringify(result.rows)}`);
            return result.rows[0];
        }
        catch (error: any) {
            logger.error(`Error in createStudent: ${error.message}`);
            throw error;
        }
    },
    updateStudent: async (student: Student): Promise<Student> => {
        try {
            const _query = {
                text: StudentQueries.UPDATE,
                values: [student.student_id, student.name, student.email, student.age, student.course, student.status]
            }
            const result = await query(_query.text, _query.values);
            logger.debug(`Query result: ${JSON.stringify(result.rows)}`);
            return result.rows[0];
        }
        catch (error: any) {
            logger.error(`Error in updateStudent: ${error.message}`);
            throw error;
        }
    },
    getStudentById: async (student_id: number): Promise<Student | null> => {
        try {
            const _query = {
                text: StudentQueries.GET_BY_ID,
                values: [student_id]
            }
            const result = await query(_query.text, _query.values);
            logger.debug(`Query result: ${JSON.stringify(result.rows)}`);
            return result.rows[0] || null;
        }
        catch (error: any) {
            logger.error(`Error in getStudentById: ${error.message}`);
            throw error;
        }
    },
    getAllStudents: async (): Promise<Student[]> => {
        try {
            const result = await query(StudentQueries.GET_ALL);
            logger.debug(`Query result: ${JSON.stringify(result.rows)}`);
            return result.rows;
        } 
        catch (error: any) {
            logger.error(`Error in getAllStudents: ${error.message}`);
            throw error;
        }
    },
    deleteStudent: async (student_id: number): Promise<void> => {
        try {
            await query(StudentQueries.DELETE, [student_id]);
            logger.debug(`Deleted student with id: ${student_id}`);
        } 
        catch (error: any) {
            logger.error(`Error in deleteStudent: ${error.message}`);
            throw error;
        }
    },
    searchStudents: async (searchTerm: string): Promise<Student[]> => {
        try {
            const result =  await query(StudentQueries.SEARCH_BY_NAME_OR_EMAIL, [`%${searchTerm}%`]);
            logger.debug(`Query result: ${JSON.stringify(result.rows)}`);
            return result.rows;
        }
        catch (error: any) {
            logger.error(`Error in searchStudents: ${error.message}`);
            throw error;
        }
    },
    existsByEmailExcludingId: async (email: string, student_id: number): Promise<boolean> => {
        try {
            const result = await query(StudentQueries.EXISTS_BY_EMAIL_EXCLUDE_ID, [email, student_id]);
            return result.rows[0].exists;
        } 
        catch (error: any) {
            logger.error(`Error in existsByEmailExcludingId: ${error.message}`);
            throw error;
        }
    }
}

export default studentRepository;