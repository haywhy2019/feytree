import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { CreateTest } from '../models/test';

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
  '/api/users/update-test-question',
  [
    body('testoptions').isString().withMessage('Question must be valid'),

    body('test_id').isString().withMessage('Id String must be valid'),
  ],
  validateRequest,
  async (req, res) => {
    const { test_id, testoptions } = req.body;
    console.log(test_id);

    const existingTest = await CreateTest.findOne({ _id: test_id });
    if (!existingTest) {
      res.status(401).send({
        message: ' this group or topic does not exists',
      });
    } else {
      console.log(JSON.parse(testoptions));
      const existingTest = await CreateTest.updateMany(
        { _id: test_id },
        {
          testoptions: JSON.parse(testoptions),
        }
      );

      res
        .status(201)
        .send({ message: 'New questions has been created', existingTest });
    }
  }
);

export { router as updateTestQuestionRouter };
