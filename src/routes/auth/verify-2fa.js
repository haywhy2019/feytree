import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../../middlewares/validate-request';
import { User } from '../../models/user';
import { RequestValidationError } from '../../errors/request-validation-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { currentUser } from '../../middlewares/current-user';
import { Password } from '../../services/password';

const router = express.Router();

router.post(
  '/api/users/verify-2fa',
  [
    body('otp')
      .isNumeric()
      .trim()
      .isLength({ min: 8, max: 8 })
      .withMessage('OTP must be between 5 Number'),
  ],
  currentUser,
  validateRequest,
  async (req, res) => {
    const { otp } = req.body;
    let payload = '';

    try {
      const token = req.headers.authorization.split(' ')[1];
      payload = jwt.verify(token, process.env.JWT_KEY);
      console.log(payload);
    } catch (error) {
      console.log(error);
    }

    const existingUser = await User.findOne({ email: payload.email });

    if (existingUser.otp === otp) {
      const userJwt = jwt.sign(
        {
          id: existingUser.id,
          email: existingUser.email,
        },
        process.env.JWT_KEY
      );
      existingUser.token = userJwt;
      return res.status(201).send({ data: existingUser, token: userJwt });
    } else {
      return res.status(400).send({ message: 'Invalid OTP' });
    }
  }
);

export { router as verify2faToken };
