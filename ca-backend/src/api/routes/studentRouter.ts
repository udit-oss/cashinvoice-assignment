import { Router } from "express";
import studentController from "../controllers/studentController";
import { authMiddleware } from "../../middleware/authMiddleware";
import { checkRole } from "../../middleware/rbacMiddleware";

const studentRouter = Router();

studentRouter.get('/search', authMiddleware, studentController.searchStudents);
studentRouter.get('/', authMiddleware, studentController.getAllStudents);
studentRouter.get('/:id', authMiddleware, studentController.getStudentById);
studentRouter.post('/', authMiddleware, checkRole(['admin']), studentController.createStudent);
studentRouter.put('/:id', authMiddleware, checkRole(['admin']), studentController.updateStudent);
studentRouter.delete('/:id', authMiddleware, checkRole(['admin']), studentController.deleteStudent);

export default studentRouter;