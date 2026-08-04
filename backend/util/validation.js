
import { body, validationResult} from "express-validator";

export const validate = (validations) =>{
    return async (req,res, next)=>{
        for (let  validation of validations) {
            const result = await validation.run(req);
            console.log(result)
            if (!result.isEmpty()) {
                break;
            }
            
        }
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(422).json({errors: errors.array()})
    };
};
export const loginvalidator = [
    
    body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email"),
    body("password")
    .trim()
    .isLength({min:6})
    .withMessage("password should conatin at least 6 character"),
];

export const signupvalidator = [
    body("name")
    .notEmpty()
    .withMessage("Name is required"),
    ...loginvalidator,
];

export const chatCompletionValidator = [
    body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required"),
    
];