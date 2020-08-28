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
  '/api/users/create-test',
  [
    body('test_name').isString().withMessage('Name must be valid'),
    body('user_id').isString().withMessage('Id String must be valid'),
    body('test_language').isString().withMessage('Language must be valid'),
    body('test_purpose').isString().withMessage('Purpose must be valid'),
    body('duration_type').isString().withMessage('duration type must be valid'),
    body('test_duration').isString().withMessage('Duration must be valid'),
  ],
  validateRequest,
  async (req, res) => {
    const {
      user_id,
      test_name,
      test_language,
      test_purpose,
      duration_type,
      test_duration,
      testoptions,
      testregistration,
    } = req.body;
    console.log(req.body);

    const existingTest = await CreateTest.findOne({
      user_id: user_id,
      test_name: test_name,
    });
    if (existingTest) {
      res.status(401).send({
        message: ' this group or topic does not exists',
      });
    } else {
      const test = await CreateTest({
        user_id,
        test_name,
        test_language,
        test_purpose,
        duration_type,
        test_duration,
      });
      await test.save();

      console.log(JSON.parse(testoptions));
      console.log(test.id);
      const existingTest = await CreateTest.updateMany(
        { _id: test.id },
        {
          testoptions: JSON.parse(testoptions),
        }
      );

      res
        .status(201)
        .send({ message: 'New Test has been created', test, existingTest });
    }
  }
);

export { router as createTestRouter };
