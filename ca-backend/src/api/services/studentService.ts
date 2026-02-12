import { logger } from "../../utils/logger";
import studentRepository from "../repositories/studentRepository";
import { Student } from "../../types";

const studentService = {
    createStudent: async (student: Student): Promise<Student> => {
        try {
            const exists = await studentRepository.existsByEmail(student.email);
            if (exists) {
                throw new Error('Student with this email already exists');
            }
            return await studentRepository.createStudent(student);
        }
        catch (error: any) {
            logger.error(`Error in createStudent: ${error.message}`);
            throw error;
        }
    },
    updateStudent: async (student: Student): Promise<Student> => {
        try {
            const existingStudent = await studentRepository.getStudentById(student.student_id!);
            if (!existingStudent) {
                throw new Error('Student not found');
            }

            const emailTaken = await studentRepository.existsByEmailExcludingId(
            student.email, 
            student.student_id!
            );
            if (emailTaken) {
            throw new Error('Email already in use by another student');
            }

            return await studentRepository.updateStudent(student);
        }
        catch (error: any) {
            logger.error(`Error in updateStudent: ${error.message}`);
            throw error;
        }
    },
    getStudentById: async (student_id: number): Promise<Student | null> => {
        try {
            return await studentRepository.getStudentById(student_id);
        }
        catch (error: any) {
            logger.error(`Error in getStudentById: ${error.message}`);
            throw error;
        }
    },
    getAllStudents: async (): Promise<Student[]> => {
        try {
            return await studentRepository.getAllStudents();
        }
        catch (error: any) {
            logger.error(`Error in getAllStudents: ${error.message}`);
            throw error;
        }
    },
    deleteStudent: async (student_id: number): Promise<void> => {
        try {
            await studentRepository.deleteStudent(student_id);
        }
        catch (error: any) {
            logger.error(`Error in deleteStudent: ${error.message}`);
            throw error;
        }
    },
    searchStudents: async (searchTerm: string): Promise<Student[]> => {
        try {
            return await studentRepository.searchStudents(searchTerm);
        }
        catch (error: any) {
            logger.error(`Error in searchStudents: ${error.message}`);
            throw error;
        }
    }
}

export default studentService;