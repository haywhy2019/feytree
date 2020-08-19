import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../../middlewares/validate-request';
import { UserAdmin } from '../../models/user-admin';
import { RequestValidationError } from '../../errors/request-validation-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { isAdmin } from '../../middlewares/admin';
import { Password } from '../../services/password';

const router = express.Router();

router.post(
  '/api/admin/verify-token',
  [
    body('otp')
      .isNumeric()
      .trim()
      .isLength({ min: 8, max: 8 })
      .withMessage('OTP must be  8 Number'),
  ],
  isAdmin,
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

    const existingUser = await UserAdmin.findOne({ email: payload.email });

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

export { router as adminVerify2faToken };
