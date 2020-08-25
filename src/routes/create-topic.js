import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { Topics } from '../models/topic';

const router = express.Router();

router.post(
  '/api/users/create-topic',
  [
    body('topic').isString().withMessage('Topic must be valid'),

    body('user_id').isNumeric().withMessage('Id Number must be valid'),
  ],
  validateRequest,
  async (req, res) => {
    const { user_id, topic } = req.body;
    console.log(user_id);

    const existingTopic = await Topics.findOne({ topic });
    if (existingTopic) {
      res.status(401).send({
        message: ' A group or topic with the same name already exists',
      });
    } else {
      const topics = Topics({
        topic,
        user_id,
      });
      await topics.save();

      res.status(201).send({ message: 'New Topic has been created' });
    }
  }
);

export { router as topicRouter };
