import Joi from 'joi';
import { Student } from '../../types';
import { CourseType, StudentStatus } from '../../enums';

const studentValidation = {
  validateCreate: (data: Partial<Student>): Joi.ValidationResult => {
    const createSchema = Joi.object({
      name: Joi.string().min(3).max(100).required(),
      email: Joi.string().email().required(),
      age: Joi.number().integer().min(1).max(120).optional(),
      course: Joi.string()
        .valid(CourseType.REACT, CourseType.NODE, CourseType.JAVA, CourseType.PYTHON)
        .required(),
      status: Joi.string()
        .valid(StudentStatus.ACTIVE, StudentStatus.INACTIVE)
        .required(),
       created_by: Joi.number().integer().required()
    });
    return createSchema.validate(data);
  },

  validateUpdate: (data: Partial<Student>): Joi.ValidationResult => {
    const updateSchema = Joi.object({
      student_id: Joi.number().integer().required(),
      name: Joi.string().min(3).max(100).required(),
      email: Joi.string().email().required(),
      age: Joi.number().integer().min(1).max(120).optional(),
      course: Joi.string()
        .valid(CourseType.REACT, CourseType.NODE, CourseType.JAVA, CourseType.PYTHON)
        .required(),
      status: Joi.string()
        .valid(StudentStatus.ACTIVE, StudentStatus.INACTIVE)
        .required()
    });
    return updateSchema.validate(data);
  }
};

export default studentValidation;