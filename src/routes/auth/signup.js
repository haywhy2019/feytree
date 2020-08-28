import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../../middlewares/validate-request';
import { User } from '../../models/user';
import { BadRequestError } from '../../errors/bad-request-error';
import { UserManager } from '../../services/user-manager';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('username').isString().withMessage('Username must be valid'),

    body('phone_number')
      .isNumeric()
      .isLength({ min: 11, max: 11 })
      .withMessage('Phone Number must be valid'),

    body('password')
      .isString()
      .isLength({ min: 8, max: 16 })
      .withMessage(
        'Password is required and must be between 8 and 16 character'
      ),
  ],
  validateRequest,
  async (req, res) => {
    const {
      email,
      username,
      phone_number,

      password,
    } = req.body;
    console.log(email);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(401).send({ message: ' Email in Use' });
    } else {
      const user = User({
        email,
        username,
        phone_number,
        password,
        app_role: 'user',
        account_status: 'inactive',
      });
      await user.save();

      const tmp_token = await UserManager.getVerificationToken(
        user,
        '12h',
        'email_verification'
      );
      console.log(tmp_token);
      const message = {
        from: 'elonmusk@tesla.com',
        to: email,
        subject: 'Feytree Verification',
        html:
          '<h1>You need to verify your  email!</h1><p> Link will expire within an hour, Click to verify your email <a href="' +
          process.env.JWT_KEY +
          '/verify-email/' +
          tmp_token +
          '">Verify Account</a> </p>',
      };
      await UserManager.sendMail(message);

      res
        .status(201)
        .send({ message: 'Verification link has been sent to your email' });
    }
  }
);

export { router as signupRouter };
