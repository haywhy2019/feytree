import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../../middlewares/validate-request';
import { UserAdmin } from '../../models/user-admin';
import { BadRequestError } from '../../errors/bad-request-error';
import { UserManager } from '../../services/user-manager';

const router = express.Router();

router.post(
  '/api/admin/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('username').isString().withMessage('Username must be valid'),
    body('user_role').isString().withMessage('Choose a user role'),
    body('phone_number')
      .isNumeric()
      .isLength({ min: 11, max: 11 })
      .withMessage('Phone Number must be valid'),
    body('company_name').isString().withMessage('Company name is require'),
  ],
  validateRequest,
  async (req, res) => {
    const {
      email,
      username,
      phone_number,
      user_role,
      company_name,
      uses,
    } = req.body;
    console.log(email);

    const existingUser = await UserAdmin.findOne({ email });
    if (existingUser) {
      res.status(401).send({ message: ' Email in Use' });
    } else {
      const user = UserAdmin({
        email,
        username,
        phone_number,
        user_role,
        company_name,
        uses,
        app_role: 'admin',
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
        to: 'atundearisekola@email.com',
        subject: 'Feytree Verification',
        html:
          '<h1>You need to verify your  email!</h1><p> Link will expire within an hour, Click to verify your email <a href="http://127.0.0.1:8000/token=' +
          tmp_token +
          '">Verify Account</a> </p>',
      };
      await UserManager.sendMail(message);

      res.status(201).send({ user, tmp_token });
    }
  }
);

export { router as adminSignupRouter };
