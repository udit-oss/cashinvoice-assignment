import { Request, Response } from 'express';
import { StatusCode } from '../../enums';
import { logger } from '../../utils/logger';
import studentValidation from '../validations/studentValidation';
import studentService from '../services/studentService';

const studentController = {
    createStudent: async (req: Request, res: Response) => {
        try {
            const student = req.body;
            student.created_by = req.user!.user_id;
            const error = studentValidation.validateCreate(student);
            
            if (error.error) {
                return res.status(StatusCode.BAD_REQUEST).json({ error: error.error.details[0].message });
            }

            const createdStudent = await studentService.createStudent(student);
            return res.status(StatusCode.CREATED).json({
                createdStudent,
                message: 'Student created successfully'
            });
        }
        catch (error: any) {
            logger.error(`Create student error: ${error.message}`);

            if (error.message.includes('already exists')) {
                return res.status(StatusCode.BAD_REQUEST).json({ error: error.message });
            }
            
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: 'Failed to create student' 
            });
        }
    },
    updateStudent: async (req: Request, res: Response) => {
        try {
            const student = req.body;
            student.student_id = parseInt(req.params.id, 10);

            if (isNaN(student.student_id)) {
                return res.status(StatusCode.BAD_REQUEST).json({ error: 'Invalid student ID' });
            }

            const error = studentValidation.validateUpdate(student);
            if (error.error) {
                return res.status(StatusCode.BAD_REQUEST).json({ error: error.error.details[0].message });
            }
            
            const updatedStudent = await studentService.updateStudent(student);
            return res.status(StatusCode.OK).json({
                updatedStudent,
                message: 'Student updated successfully'
            });
        }
        catch (error: any) {
            logger.error(`Update student error: ${error.message}`);
            
            if (error.message.includes('not found')) {
            return res.status(StatusCode.NOT_FOUND).json({ error: error.message });
            }
            
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
            error: 'Failed to update student' 
            });
        }
    },
    getStudentById: async (req: Request, res: Response) => {
        try {
            const student_id = parseInt(req.params.id, 10);
            const student = await studentService.getStudentById(student_id);
            if (!student) {
                return res.status(StatusCode.NOT_FOUND).json({ error: 'Student not found' });
            }
            return res.status(StatusCode.OK).json(student);
        }
        catch (error: any) {
            logger.error(`Get student by ID error: ${error.message}`);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: 'Failed to retrieve student' 
            });
        }
    },
    getAllStudents: async (req: Request,res: Response) => {
        try {
            const students = await studentService.getAllStudents();
            return res.status(StatusCode.OK).json(students);
        }
        catch (error: any) {
            logger.error(`Get all students error: ${error.message}`);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: 'Failed to retrieve students' 
            });
        }
    },
    deleteStudent: async (req: Request, res: Response) => {
        try {
            const student_id = parseInt(req.params.id, 10);
            await studentService.deleteStudent(student_id);
            return res.status(StatusCode.OK).json({ message: 'Student deleted successfully' });
        }
        catch (error: any) {
            logger.error(`Delete student error: ${error.message}`);
            
            if (error.message.includes('not found')) {
                return res.status(StatusCode.NOT_FOUND).json({ error: error.message });
            }
            
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: 'Failed to delete student' 
            });
        }
    },
    searchStudents: async (req: Request, res: Response) => {
        try {
            const { term } = req.query;
            
            if (!term || typeof term !== 'string') {
                return res.status(StatusCode.BAD_REQUEST).json({ 
                    error: 'Search term is required' 
                });
            }

            const students = await studentService.searchStudents(term);
            return res.status(StatusCode.OK).json(students);
        } catch (error: any) {
            logger.error(`Search students error: ${error.message}`);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
                error: 'Failed to search students' 
            });
        }
    }
}

export default studentController;