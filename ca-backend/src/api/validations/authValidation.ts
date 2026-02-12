import Joi from "joi";
import { LoginRequest } from "../../types";

const UserValidations = {
    validateLoginDetails: (data: LoginRequest): Joi.ValidationResult => {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        })
        return loginSchema.validate(data);
    }
}

export default UserValidations;