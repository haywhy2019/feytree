import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { CreateTest } from '../models/test';

const router = express.Router();

router.post(
  '/api/users/create-question',
  [
    body('access_time').isString().withMessage('Question must be valid'),
    body('to').isString().withMessage('Question must be valid'),

    body('test_id').isString().withMessage('Id String must be valid'),
  ],
  validateRequest,
  async (req, res) => {
    const { test_id, access_time } = req.body;
    console.log(req.body);

    const existingTest = await CreateTest.findOne({ _id: test_id });
    if (!existingTest) {
      res.status(401).send({
        message: ' this group or topic does not exists',
      });
    } else {
      if (access_time === 'anytime') {
        existingTest.test_link.access_time.set({ any_time: true });
      } else {
        existingTest.test_link.access_time.set({
          any_time: false,
          from: access_time.from,
          to: access_time.to,
        });
      }

      existingTest.save();

      res
        .status(201)
        .send({ message: 'New questions has been created', existingTest });
    }
  }
);

export { router as testLinkRouter };
