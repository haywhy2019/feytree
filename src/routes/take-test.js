import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { CreateTest } from '../models/test';
import { TestTaker } from '../models/test_taker';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.get('/api/users/take-test/:taker_id', async (req, res) => {
  const { taker_id } = req.params.taker_id;

  const existingTest = await TestTaker.findOne({ _id: taker_id });
  if (!existingTest) {
    res.status(204).send({
      message: 'This taker does not exist!',
    });
  } else {
    const test = await CreateTest.findOne({ _id: existingTest.test_id });

    res.status(201).send({
      message: 'New Test has been registered',
      data: test,
      taker: existingTest,
    });
  }
});

export { router as takeTestRouter };
