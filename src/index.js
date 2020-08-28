import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';

import { currentAdminRouter } from './routes/admin-routes/current-user';
import { adminSigninRouter } from './routes/admin-routes/signin';
import { adminSignoutRouter } from './routes/admin-routes/signout';
import { adminSignupRouter } from './routes/admin-routes/signup';
import { adminForgotpasswordRouter } from './routes/admin-routes/forgot-password';
import { adminSetPasswordRouter } from './routes/admin-routes/set-password';
import { adminEmailVerificationRouter } from './routes/admin-routes/verify-email';
import { adminSendTokenRouter } from './routes/admin-routes/send-token';
import { adminSendEmailVerificationRouter } from './routes/admin-routes/send-verification';
import { adminVerify2faToken } from './routes/admin-routes/verify-2fa';

//////////////////////////////

import { currentUserRouter } from './routes/auth/current-user';
import { signinRouter } from './routes/auth/signin';
import { signoutRouter } from './routes/auth/signout';
import { signupRouter } from './routes/auth/signup';
import { forgotpasswordRouter } from './routes/auth/forgot-password';
import { setPasswordRouter } from './routes/auth/set-password';
import { sendTokenRouter } from './routes/auth/send-token';
import { sendEmailVerificationRouter } from './routes/auth/send-verification';
import { emailVerificationRouter } from './routes/auth/verify-email';
import { verify2faToken } from './routes/auth/verify-2fa';
import { createTopicRouter } from './routes/create-topic';
import { createQuestionRouter } from './routes/create-question';

import { allTopicsRouter } from './routes/all-topics';
import { allQuestionsRouter } from './routes/all-question';
import { TopicQuestionsRouter } from './routes/topic-questions';
import { testLinkRouter } from './routes/test-link';
import { createTestRouter } from './routes/create-test';
import { updateRegRouter } from './routes/update-registration-field';
import { updateTestQuestionRouter } from './routes/update-test-question';

import { errorHandler } from './middlewares/error-handler';

import { NotFoundError } from './errors/not-found-error';

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(emailVerificationRouter);
app.use(forgotpasswordRouter);
app.use(setPasswordRouter);
app.use(sendTokenRouter);
app.use(sendEmailVerificationRouter);
app.use(verify2faToken);
app.use(createTopicRouter);
app.use(createQuestionRouter);

app.use(allTopicsRouter);
app.use(allQuestionsRouter);
app.use(TopicQuestionsRouter);
app.use(testLinkRouter);
app.use(createTestRouter);
app.use(updateRegRouter);
app.use(updateTestQuestionRouter);

////////////////////////////

app.use(currentAdminRouter);
app.use(adminSigninRouter);
app.use(adminSignoutRouter);
app.use(adminSignupRouter);
app.use(adminEmailVerificationRouter);
app.use(adminForgotpasswordRouter);
app.use(adminSetPasswordRouter);

app.use(adminSendTokenRouter);
app.use(adminSendEmailVerificationRouter);
app.use(adminVerify2faToken);

app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Connected to Mongo DB !!!');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!');
  });
};

start();
