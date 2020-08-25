import express from 'express';
import jwt from 'jsonwebtoken';

import { currentUser } from '../middlewares/current-user';
import { User } from '../models/user';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.get('/api/users/verify-email', currentUser, async (req, res) => {
  let payload = '';

  try {
    const token = req.headers.authorization.split(' ')[1];
    payload = jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    console.log(error);
  }

  const { email, reason } = payload;
  const existingUser = await User.findOne({ email: email });
  if (existingUser.app_role === 'user') {
    existingUser.set({ account_status: 'active' });
  } else {
    existingUser.set({ account_status: 'pre_active' });
  }
  existingUser.save();

  res.status(201).send({ message: 'Email has been verified', existingUser });
});

export { router as emailVerificationRouter };
