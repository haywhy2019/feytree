import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { CreateTest } from '../models/test';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.post(
  '/api/users/all-test',
  [body('user_id').isString().withMessage('Id Number must be valid')],
  currentUser,
  validateRequest,
  async (req, res) => {
    const { user_id } = req.body;

    const existingTest = await CreateTest.find({ user_id });
    if (!existingTest) {
      res.status(204).send({
        message: 'You do not have any question yet!',
      });
    } else {
      res
        .status(200)
        .send({ message: 'All topic has been fetched', data: existingTest });
    }
  }
);

export { router as allQuestionsRouter };
