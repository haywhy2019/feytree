import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { CreateTest } from '../models/test';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.post(
  '/api/users/new-test/:test_id',
  [body('test_id').isString().withMessage('Id Number must be valid')],

  validateRequest,
  async (req, res) => {
    const { test_id } = req.params.test_id;

    const existingTest = await CreateTest.findOne(
      { _id: test_id },
      'testregistration id',
      function (err, test) {
        if (err)
          return res.status(204).send({
            message: err,
          });
        res.status(200).send({
          message: 'Test has been fetched',
          data: test,
        });
      }
    );
  }
);

export { router as takeNewTestsRouter };
