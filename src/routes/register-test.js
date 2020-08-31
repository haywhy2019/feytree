import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { CreateTest } from '../models/test';
import { TestTaker } from '../models/test_taker';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.post(
  '/api/users/register-test',
  [
    body('test_id').isString().withMessage('Id Number must be valid'),
    body('email').isString().withMessage('Id Number must be valid'),
    body('first_name').isString().withMessage('Id Number must be valid'),
    body('testregistration').isString().withMessage(' must be valid'),
  ],
  currentUser,
  validateRequest,
  async (req, res) => {
    const { test_id, testregistration } = req.body;

    const existingTest = await CreateTest.findOne({ _id: test_id });
    if (!existingTest) {
      res.status(204).send({
        message: 'This test does not exist!',
      });
    } else {
      const test = await TestTaker({
        test_id,
        email,
        first_name,
      });
      await test.save();

      const existingTest = await TestTaker.updateMany(
        { _id: test.id },
        {
          testregistration: JSON.parse(testregistration),
        }
      );

      res
        .status(201)
        .send({ message: 'New Test has been registered', test, existingTest });
    }
  }
);

export { router as testRegistrationRouter };
