import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import notification from '../services/notifyUser.js';

import validateRequest from '../utils/validation.js';
import { signupSchema, loginSchema, verifyEmailSchema } from "../validations/auth.js";

const { genSalt, hash, compare } = bcrypt;

export const signUp = async (req, res, next) => {
    try {
        const validationErrors = validateRequest(req.body, signupSchema);
        if (validationErrors)
            return res.status(400).json({ code: 400, errors: validationErrors });

        const isUserExists = await User.findOne({ where: { email: req.body.email } });
        if (isUserExists) return res.status(400).json({ code: 400, errors: 'User exists' });

        const salt = await genSalt(10);
        const password = await hash(req.body.password, salt);

        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        const user = {
            name: req.body.name,
            email: req.body.email,
            password: password,
            verificationCode: verificationCode,
        };

        await User.create(user);
        notification.send(`Verify your email using this code: ${user.verificationCode}`, user.email)

        return res
            .status(200)
            .json({ code: 200, message: 'You\'re all set! Your account has been created successfully. Please check your inbox to verify your email.' });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const validationErrors = validateRequest(req.body, loginSchema);
        if (validationErrors)
            return res.status(400).json({ code: 400, errors: validationErrors });

        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user)
            return res
                .status(401)
                .json({ code: 401, message: 'Invalid Credentials' });

        const validPassword = await compare(req.body.password, user.password);
        if (!validPassword)
            return res
                .status(401)
                .json({ code: 401, message: 'Invalid Credentials' });

        if (user.isVerified == false)
            return res
                .status(401)
                .json({ code: 401, message: "Please verify your email and login" });

        const token = jwt.sign(
            { uuid: user.userUUID, email: user.email },
            process.env.JWT_TOKEN_SECRET,
        );

        return res.status(200).json({ code: 200, message: "Loged in successfully", token: token });
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const validationErrors = validateRequest(req.body, verifyEmailSchema);
        if (validationErrors)
            return res.status(400).json({ code: 400, message: validationErrors });

        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) return res.status(404).json({ code: 404, message: 'Email not found' });

        if (user.isVerified == true) {
            return res.status(400).json({ code: 400, message: 'Your Email is already verified' });
        }

        if (user.verificationCode != req.body.verificationCode) {
            return res.status(401).json({ code: 401, message: 'Invalid verification code' });
        }

        user.isVerified = 1;
        await user.save();

        return res.status(200).json({ code: 200, message: 'Email verified successfully' });
    } catch (error) {
        next(error);
    }
};