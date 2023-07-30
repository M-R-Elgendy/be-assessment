import Joi from 'joi';

export const signupSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
});

export const verifyEmailSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    verificationCode: Joi.number().integer().min(100000).max(999999).required().messages({
        "number.min": `Verification code should contain 6 numbers`,
        "number.max": `Verification code should contain 6 numbers`,
    }),
});