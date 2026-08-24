
import { body, validationResult } from "express-validator";

export const validate = (validations) => {
    return async (req, res, next) => {

        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(422).json({ errors: errors.array() })
    };
};
export const loginvalidator = [

    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .normalizeEmail()
        .isEmail()
        .withMessage("Invalid email")
        .isLength({max: 50})
        .withMessage("Email can not be longer than 50 characters."),
    body("password")
        .trim()
        .isLength({max: 60})
        .withMessage("Password can not be longer than 60 characters.")
        .isStrongPassword({ 
            minLength: 14,
            minLowercase: 0,
            minUppercase: 0,
            minNumbers: 0,
            minSymbols: 0,

        })
        .withMessage("password should conatin atleast 14 character")
        .isStrongPassword({ 
            minLength: 0,
            minLowercase: 2,
            minUppercase: 0,
            minNumbers: 0,
            minSymbols: 0,
        })
        .withMessage("password should conatin atleast 2 Lowercase letters")
        .isStrongPassword({ 
            minLength: 0,
            minLowercase: 0,
            minUppercase: 4,
            minNumbers: 0,
            minSymbols: 0,

        })
        .withMessage("password should conatin atleast 4 Uppercase letters")
        .isStrongPassword({ 
            minLength: 0,
            minLowercase: 0,
            minUppercase: 0,
            minNumbers: 4,
            minSymbols: 0,

        })
        .withMessage("password should conatin atleast 4 numbers")
        .isStrongPassword({ 
            minLength: 0,
            minLowercase: 0,
            minUppercase: 0,
            minNumbers: 0,
            minSymbols: 4,
            

        })
        .withMessage("password should conatin at least 4 Special characters")
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
        .withMessage("Message is required")
        .isLength({min: 5})
        .withMessage("Not shorter than 5 charactor")
        .isLength({ max: 100})
        .withMessage("Not Longer than 100 charactor"),
];