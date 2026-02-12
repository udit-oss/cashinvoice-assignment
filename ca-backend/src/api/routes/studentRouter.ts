import { Router } from "express";
import studentController from "../controllers/studentController";
import { authMiddleware } from "../../middleware/authMiddleware";
import { checkRole } from "../../middleware/rbacMiddleware";

const studentRouter = Router();

studentRouter.post('/', authMiddleware, checkRole(['admin']), studentController.createStudent);
studentRouter.put('/:id', authMiddleware, checkRole(['admin']), studentController.updateStudent);
studentRouter.delete('/:id', authMiddleware, checkRole(['admin']), studentController.deleteStudent);
studentRouter.get('/:id', authMiddleware, studentController.getStudentById);
studentRouter.get('/', authMiddleware, studentController.getAllStudents);

export default studentRouter;