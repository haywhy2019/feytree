import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { CreateTest } from '../models/test';
import { TestTaker } from '../models/test_taker';
import { currentUser } from '../middlewares/current-user';
import { UserManager } from '../services/user-manager';

const router = express.Router();

router.post(
  '/api/users/register-test',
  [
    body('test_id').isString().withMessage('Id Number must be valid'),
    body('email').isString().withMessage('Id Number must be valid'),
    body('first_name').isString().withMessage('Id Number must be valid'),
    body('testregistration').isString().withMessage(' must be valid'),
  ],

  validateRequest,
  async (req, res) => {
    const { test_id, testregistration } = req.body;

    const existingEmail = await TestTaker.findOne({ email, test_id });
    const existingTest = await CreateTest.findOne({ _id: test_id });
    if (!existingTest) {
      res.status(204).send({
        message: 'This test does not exist!',
      });
    } else if (existingEmail) {
      const message = {
        from: 'elonmusk@tesla.com',
        to: email,
        subject: 'Feytree Test Registration',
        html:
          '<h1>Your test registeration is successful</h1><p>  Click here start test <a href="' +
          process.env.CLIENT_URL +
          '/take-test/' +
          test.id +
          '">Verify Account</a> </p>',
      };
      await UserManager.sendMail(message);
      res.status(204).send({
        message: 'This Email has already been registered!',
      });
    } else {
      const test = await TestTaker({
        test_id,
        email,
        first_name,
      });
      await test.save();

      existingTest.test_takers.push(test.id);
      await existingTest.save();

      const existingUpdate = await TestTaker.updateMany(
        { _id: test.id },
        {
          testregistration: JSON.parse(testregistration),
        }
      );

      const message = {
        from: 'elonmusk@tesla.com',
        to: email,
        subject: 'Feytree Test Registration',
        html:
          '<h1>Your test registeration is successful</h1><p>  Click here to start test <a href="' +
          process.env.CLIENT_URL +
          '/take-test/' +
          test.id +
          '">Verify Account</a> </p>',
      };
      await UserManager.sendMail(message);

      res.status(201).send({
        message: 'New Test has been registered',
        test,
        existingUpdate,
      });
    }
  }
);

export { router as testRegistrationRouter };
