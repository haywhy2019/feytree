import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { Topics } from '../models/topic';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.post(
  '/api/users/all-topics',
  [body('user_id').isString().withMessage('Id Number must be valid')],
  currentUser,
  validateRequest,
  async (req, res) => {
    const { user_id } = req.body;

    Topics.find({}, 'topic id', function (err, topic) {
      if (err)
        return res.status(204).send({
          message: err,
        });
      res.status(200).send({
        message: 'All topic has been fetched',
        data: topic,
      });
    });
  }
);

export { router as allTopicsRouter };
