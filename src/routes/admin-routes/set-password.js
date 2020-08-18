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
  '/api/admin/set-password',
  [
    body('email').isEmail().withMessage('Email must be valid'),

    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 character'),
  ],
  isAdmin,
  validateRequest,
  async (req, res) => {
    const { email, password } = req.body;
    //const hash_password = await Password.toHash(password);
    const existingUser = await UserAdmin.findOne(
      { email: email }
      // { password: hash_password, account_status: 'active' },

      // {
      //  new: true,
      //}
    );
    existingUser.set({ password, account_status: 'active' });
    await existingUser.save();

    res.status(201).send({ data: existingUser });
  }
);

export { router as adminSetPasswordRouter };
