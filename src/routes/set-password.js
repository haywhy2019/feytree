import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';
import { currentUser } from '../middlewares/current-user';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/set-password',
  [
    body('email').isEmail().withMessage('Email must be valid'),

    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 character'),
  ],
  currentUser,
  validateRequest,
  async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    existingUser.set({ password, account_status: 'active' });
    await existingUser.save();

    res
      .status(201)
      .send({ data: existingUser, message: 'New Password has been set' });
  }
);

export { router as setPasswordRouter };
