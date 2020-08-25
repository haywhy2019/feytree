import express from 'express';
import jwt from 'jsonwebtoken';

import { currentUser } from '../middlewares/current-user';
import { User } from '../models/user';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { BadRequestError } from '../errors/bad-request-error';
import { UserManager } from '../services/user-manager';

const router = express.Router();

router.get('/api/users/send-verification', currentUser, async (req, res) => {
  let payload = '';

  try {
    const token = req.headers.authorization.split(' ')[1];
    payload = jwt.verify(token, process.env.JWT_KEY);
    console.log(payload);
  } catch (error) {
    console.log(error);
  }

  const { email, reason } = payload;
  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    res.status(401).send({ message: 'Invalid credential' });
  } else {
    const tmp_token = await UserManager.getVerificationToken(
      existingUser,
      '1h',
      'email_verification'
    );
    const message = {
      from: 'elonmusk@tesla.com',
      to: email,
      subject: 'Feytree Verification Request',
      html:
        '<h1>Email Verification!</h1><p> Click link to verify your email, Click to change your password <a href="http://127.0.0.1:8000/token=' +
        tmp_token +
        '">Change Password</a></p>',
    };
    await UserManager.sendMail(message);

    res.status(200).send(existingUser);
  }
});

export { router as sendEmailVerificationRouter };
