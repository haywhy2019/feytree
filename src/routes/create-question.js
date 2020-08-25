import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { Topics } from '../models/topic';

const router = express.Router();

router.post(
  '/api/users/create-question',
  [
    body('question').isString().withMessage('Question must be valid'),
    body('options').isJSON().withMessage('Topic must be valid'),
    body('anwers').isJSON().withMessage('Topic must be valid'),
    body('anwers_key').isString().withMessage('Topic must be valid'),
    body('tags').isArray().withMessage('Question must be valid'),
    body('topic_id').isNumeric().withMessage('Id Number must be valid'),
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
        question,
        options,
        answer,
        answer_key,
        tags,
        topic_id,
      });
      await topics.save();

      res.status(201).send({ message: 'New Topic has been created' });
    }
  }
);

export { router as topicRouter };
