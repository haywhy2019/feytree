import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { Topics } from '../models/topic';

/**
 * @description Converts a string response to an array of objects.
 * @param {string} string - The string you want to convert.
 * @returns {array} - an array of objects.
 */
function stringToJson(input) {
  var result = [];

  //replace leading and trailing [], if present
  input = input.replace(/^\[/, '');
  input = input.replace(/\]$/, '');

  //change the delimiter to
  input = input.replace(/},{/g, '};;;{');

  // preserve newlines, etc - use valid JSON
  //https://stackoverflow.com/questions/14432165/uncaught-syntaxerror-unexpected-token-with-json-parse
  input = input
    .replace(/\\n/g, '\\n')
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, '\\&')
    .replace(/\\r/g, '\\r')
    .replace(/\\t/g, '\\t')
    .replace(/\\b/g, '\\b')
    .replace(/\\f/g, '\\f');
  // remove non-printable and other non-valid JSON chars
  input = input.replace(/[\u0000-\u0019]+/g, '');

  input = input.split(';;;');

  input.forEach(function (element) {
    // console.log(JSON.stringify(element));

    result.push(JSON.parse(element));
  }, this);

  return result;
}

const router = express.Router();

router.post(
  '/api/users/create-question',
  [
    body('question').isString().withMessage('Question must be valid'),

    body('topic_id').isString().withMessage('Id String must be valid'),
  ],
  validateRequest,
  async (req, res) => {
    const { topic_id, question } = req.body;
    console.log(req.body);

    const existingTopic = await Topics.findOne({ _id: topic_id });
    if (!existingTopic) {
      res.status(401).send({
        message: ' this group or topic does not exists',
      });
    } else {
      /// var q = JSON.parse(question);
      // console.log(q);
      //var nq = stringToJson(question.slice(0, question.length - 1));
      //console.log(nq);
      console.log(JSON.parse(question));
      const existingTopic = await Topics.updateMany(
        { _id: topic_id },
        {
          questions: JSON.parse(question),
        }
      );

      // existingTopic.questions.push({
      //  question: question.question,
      // });
      // await existingTopic.save();

      res
        .status(201)
        .send({ message: 'New questions has been created', existingTopic });
    }

    /*
    const existingTopic = await Topics.update(
      { id: topic_id },
      { $push: { topics: { $each: question } } }
    );

    res
      .status(201)
      .send({ message: 'New questions has been created', existingTopic });

      */
  }
);

export { router as createQuestionRouter };
