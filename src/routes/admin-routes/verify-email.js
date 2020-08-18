import express from 'express';
import jwt from 'jsonwebtoken';

import { isAdmin } from '../../middlewares/admin';
import { UserAdmin } from '../../models/user-admin';
import { NotAuthorizedError } from '../../errors/not-authorized-error';
import { BadRequestError } from '../../errors/bad-request-error';

const router = express.Router();

router.get('/api/admin/verify-email', isAdmin, async (req, res) => {
  let payload = '';

  try {
    const token = req.headers.authorization.split(' ')[1];
    payload = jwt.verify(token, process.env.JWT_KEY);
    console.log(payload);
  } catch (error) {
    console.log(error);
  }

  const { email, reason } = payload;
  const existingUser = await UserAdmin.findOneAndUpdate(
    { email: email },
    { account_status: 'pre_active' },
    {
      new: true,
    }
  );

  res.status(201).send({ mes: existingUser });
});

export { router as adminEmailVerificationRouter };
