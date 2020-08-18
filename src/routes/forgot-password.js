import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { UserManager } from '../services/user-manager';
const router = express.Router();

router.get(
  '/api/users/forgotpassword',
  [body('email').isEmail().withMessage('Email must be valid')],
  validateRequest,
  async (req, res) => {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      res.status(401).send({ message: 'Invalid credential' });
    } else {
      const tmp_token = await UserManager.getVerificationToken(
        existingUser,
        '1h',
        'password_reset'
      );
      const message = {
        from: 'elonmusk@tesla.com',
        to: 'to@email.com',
        subject: 'Feytree Password Request',
        html:
          '<h1>Forget Password Request!</h1><p> Click link to change password, Click to change your password <a href="http://127.0.0.1:8000/token=' +
          tmp_token +
          '">Change Password</a></p>',
      };
      await UserManager.sendMail(message);

      res.status(200).send(existingUser);
    }
  }
);

export { router as forgotpasswordRouter };
