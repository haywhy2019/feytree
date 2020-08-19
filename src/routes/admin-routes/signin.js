import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { Password } from '../../services/password';
import { validateRequest } from '../../middlewares/validate-request';
import mongoose from 'mongoose';
import { UserAdmin } from '../../models/user-admin';
import { BadRequestError } from '../../errors/bad-request-error';
import { UserManager } from '../../services/user-manager';

const router = express.Router();

router.post(
  '/api/admin/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),

    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await UserAdmin.findOne({ email });

    if (!existingUser) {
      return res.status(401).send({ message: ' Invalid credential' });
    } else if (existingUser.account_status == 'inactive') {
      const tmp_token = await UserManager.getVerificationToken(
        existingUser,
        '5h',
        'email_verification'
      );
      const message = {
        from: 'elonmusk@tesla.com',
        to: 'to@email.com',
        subject: 'Feytree Verification',
        html:
          '<h1>You need to verify your email!</h1><p> Link will expire within an hour, Click to verify your email <a href="http://127.0.0.1:8000/token=' +
          tmp_token +
          '">Verify Account</a></p>',
      };
      await UserManager.sendMail(message);

      return res.status(201).send(existingUser);
    } else if (existingUser.account_status == 'pre_active') {
      const tmp_token = await UserManager.getVerificationToken(
        existingUser,
        '5h',
        'password_reset'
      );
      const message = {
        from: 'elonmusk@tesla.com',
        to: 'to@email.com',
        subject: 'Feytree Verification',
        html:
          '<h1>You need to verify your email!</h1><p> Link will expire within an hour, Click to verify your email <a href="http://127.0.0.1:8000/token=' +
          tmp_token +
          '">Verify Account</a></p>',
      };
      await UserManager.sendMail(message);

      return res.status(201).send(existingUser);
    } else {
      const passwordsMatch = await Password.compare(
        existingUser.password,
        password
      );
      if (!passwordsMatch) {
        res.status(401).send({ message: ' Invalid creadentials' });
      } else {
        const otp = await UserManager.sendOTP(100000000);
        console.log(otp);
        existingUser.set({ otp: otp });
        await existingUser.save();
        const tmp_token = await UserManager.getVerificationToken(
          existingUser,
          '5h',
          '2FA'
        );
        const message = {
          from: 'elonmusk@tesla.com',
          to: 'to@email.com',
          subject: 'Feytree 2FA Verification',
          html:
            '<h1>You need to verify your email!</h1><p> 2FA will expire within an hour, your 2FA is ' +
            otp +
            ' Click to verify your email </p>',
        };
        await UserManager.sendMail(message);

        return res.status(200).send({ existingUser, token: tmp_token });

        /*
        const userJwt = jwt.sign(
          {
            id: existingUser.id,
            email: existingUser.email,
          },
          process.env.JWT_KEY
        );
        existingUser.token = userJwt;

        return res.status(200).send({ data: existingUser, token: userJwt });
        */
      }
    }
  }
);

export { router as adminSigninRouter };
