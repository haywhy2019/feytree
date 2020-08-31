import mongoose from 'mongoose';

var registrationSchema = new mongoose.Schema({
  text_field: {
    type: String,
    required: true,
  },

  field_value: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: false,
  },
  mandetory: {
    type: Boolean,
    required: false,
  },
  verify: {
    type: Boolean,
    required: false,
  },
});

var questionsSchema = new mongoose.Schema({
  question_id: {
    type: String,
    required: false,
  },
  question: {
    type: String,
    required: false,
  },
  options: [
    {
      option: {
        type: String,
        required: false,
      },
      isCorrect: {
        type: Boolean,
        required: true,
        default: false,
      },
      allocated_mark: {
        type: Number,
        required: false,
      },
    },
  ],
});

var testResultsSchema = new mongoose.Schema({
  section_name: {
    type: String,
    required: false,
  },
  topic_name: {
    type: String,
    required: false,
  },
  topic_id: {
    type: String,
    required: false,
  },
  questions: [questionsSchema],
});

const testTakerSchema = new mongoose.Schema(
  {
    test_id: {
      type: String,
      required: true,
    },
    total_score: {
      type: String,
      required: true,
    },

    testResult: [testResultsSchema],
    testregistration: [registrationSchema],

    test_link: {
      access_time: {
        from: {
          type: Date,
          required: false,
        },
        to: {
          type: Date,
          required: false,
        },
      },

      finish_state: {
        type: String,
        enum: ['Normal', 'TimeUP'],
        default: 'Normal',
      },

      link: {
        type: String,
        required: false,
      },
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;

        delete ret.__v;
      },
    },
  }
);

const TestTaker = mongoose.model('TestTaker', testTakerSchema);

export { TestTaker };
