import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { Topics } from '../models/topic';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.post(
  '/api/users/all-topics',
  [
    body('user_id').isString().withMessage('Id Number must be valid'),
    body('topic_id').isString().withMessage('Id Number must be valid'),
  ],
  currentUser,
  validateRequest,
  async (req, res) => {
    const { user_id } = req.body;

    const existingTopic = await Topics.findOne({ user_id, _id: topic_id });
    if (!existingTopic) {
      res.status(204).send({
        message: 'You do not have any question yet!',
      });
    } else {
      res
        .status(200)
        .send({
          message: 'All topic questions has been fetched',
          data: existingTopic,
        });
    }
  }
);

export { router as TopicQuestionsRouter };
