import express from 'express';
import jwt from 'jsonwebtoken';

import { isAdmin } from '../../middlewares/admin';
import { UserAdmin } from '../../models/user-admin';
import { NotAuthorizedError } from '../../errors/not-authorized-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { UserManager } from '../../services/user-manager';

const router = express.Router();

router.post('/api/admin/send-token', isAdmin, async (req, res) => {
  let payload = '';

  try {
    const token = req.headers.authorization.split(' ')[1];
    payload = jwt.verify(token, process.env.JWT_KEY);
    console.log(payload);
  } catch (error) {
    console.log(error);
  }

  const { email, reason } = payload;
  const existingUser = await UserAdmin.findOne({ email: email });
  if (!existingUser) {
    return res.status(401).send({ message: 'Invalid credential' });
  } else {
    const otp = await UserManager.sendOTP(100000000);
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
        '  </p>',
    };
    await UserManager.sendMail(message);

    res.status(200).send({ token: tmp_token, otp: otp });
  }
});

export { router as adminSendTokenRouter };
