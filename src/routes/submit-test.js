import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { CreateTest } from '../models/test';
import { TestTaker } from '../models/test_taker';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.post(
  '/api/users/submit-test',
  [
    body('taker_id').isString().withMessage('Id Number must be valid'),

    body('testresult').isString().withMessage(' must be valid'),
  ],
  currentUser,
  validateRequest,
  async (req, res) => {
    const { taker_id, testresult } = req.body;

    const existingTest = await TestTaker.findOne({ _id: taker_id });
    if (!existingTest) {
      res.status(204).send({
        message: 'This taker does not exist!',
      });
    } else {
      test_result = JSON.parse(testresult);

      if (test_result.length) {
        var overall_total_score = 0;
        var overall_pass_score = 0;
        var overall_total_topic = 0;
        var total_question = 0;
        var overall_correct_answer = 0;
        var overall_incorrect_answer = 0;
        var sectionArr = [];

        test_result.forEach((element) => {
          var topicArr = [];
          var total_topic = 0;
          var section_total_score = 0;
          var section_pass_score = 0;
          var section_total_question = 0;

          var section_correct_answer = 0;
          var section_incorrect_answer = 0;
          overall_total_topic = +total_topic;
          total_question = section_total_question;
          overall_correct_answer = section_correct_answer;
          overall_incorrect_answer = section_incorrect_answer;
          overall_pass_score = +section_pass_score;
          overall_total_score = +section_total_score;
          element.topics.forEach((topic) => {
            var questionArrs = [];
            var topic_total_score = 0;
            var topic_pass_score = 0;
            var topic_total_question = 0;
            var topic_correct_answer = 0;
            var topic_incorrect_answer = 0;

            total_topic = +total_topic;
            section_total_question = +topic_total_question;

            section_correct_answer = +topic_correct_answer;
            section_incorrect_answer = +topic_incorrect_answer;
            section_total_score = +topic_total_score;
            section_pass_score = +topic_pass_score;

            topic.questions.forEach((questions) => {
              var passs_score = 0;
              var correct_answer = 0;
              var incorrect_answer = 0;
              var total_score = 0;

              topic_total_question = topic_total_question + 1;
              topic_correct_answer = topic_correct_answer + correct_answer;
              topic_incorrect_answer =
                topic_incorrect_answer + incorrect_answer;
              topic_total_score = +total_score;
              topic_pass_score = +passs_score;
              questions.forEach((options) => {
                total_score = +options.allocated_mark;
                if (options.isSelected && options.isCorrect) {
                  passs_score = +options.allocated_mark;
                  correct_answer = correct_answer + 1;
                } else if (options.isSelected && !options.isCorrect) {
                  incorrect_answer = incorrect_answer + 1;
                }
              });
              questionArrs.push({
                question: question.question,
                correct_answer: correct_answer,
                incorrect_answer: incorrect_answer,
                total_score: total_score,
                pass_score: pass_score,
              });
            });
            topicArr.push({
              topic_name: topic.topic_name,
              topic_correct_answer: topic_correct_answer,
              topic_incorrect_answer: topic_incorrect_answer,
              topic_total_question: topic_total_question,
              topic_total_score: topic_total_score,
              topic_pass_score: topic_pass_score,
              questions: questionArrs,
            });
          });
          sectionArr.push({
            section: element.section_name,

            section_correct_answer: topic_correct_answer,
            section_incorrect_answer: section_incorrect_answer,
            total_topic: total_topic,
            section_total_question: section_total_question,
            section_total_score: section_total_score,
            section_pass_score: section_pass_score,
            topic: topicArr,
          });
        });

        existingTest.set({
          overall_total_score: overall_total_score,
          overall_pass_score: overall_pass_score,
          overall_total_topic: overall_total_topic,
          total_question: total_question,
          overall_correct_answer: overall_correct_answer,
          overall_incorrect_answer: overall_incorrect_answer,
        });

        await existingTest.save();

        const existingTestUpdate = await TestTaker.updateMany(
          { _id: taker_id },
          {
            testresult: JSON.parse(sectionArr),
          }
        );

        res.status(201).send({
          message: 'New Test has been registered',
          test,
          existingTestUpdate,
        });
      }
    }
  }
);

export { router as submitTestRouter };
