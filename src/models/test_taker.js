import mongoose from 'mongoose';

var registrationSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

var questionsSchema = new mongoose.Schema(
  {
    question_id: {
      type: String,
      required: false,
    },
    question: {
      type: String,
      required: false,
    },
    total_score: {
      type: Number,
      required: false,
    },
    pass_score: {
      type: Number,
      required: false,
    },

    correct_answer: {
      type: Number,
      required: false,
    },
    incorrect_answer: {
      type: Number,
      required: false,
    },
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
  },
  { timestamps: true }
);

var topicsSchema = new mongoose.Schema(
  {
    topic_name: {
      type: String,
      required: false,
    },
    topic_total_score: {
      type: Number,
      required: false,
    },
    topic_pass_score: {
      type: Number,
      required: false,
    },

    topic_total_question: {
      type: Number,
      required: false,
    },
    topic_correct_answer: {
      type: Number,
      required: false,
    },
    topic_incorrect_answer: {
      type: Number,
      required: false,
    },

    questions: [questionsSchema],
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
  },
  { timestamps: true }
);

var testResultsSchema = new mongoose.Schema(
  {
    section_name: {
      type: String,
      required: false,
    },
    section_total_score: {
      type: Number,
      required: false,
    },
    section_pass_score: {
      type: Number,
      required: false,
    },
    section_total_topic: {
      type: Number,
      required: false,
    },
    section_total_question: {
      type: Number,
      required: false,
    },
    section_correct_answer: {
      type: Number,
      required: false,
    },
    section_incorrect_answer: {
      type: Number,
      required: false,
    },

    topics: [topicsSchema],
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
  },
  { timestamps: true }
);

const testTakerSchema = new mongoose.Schema(
  {
    test_id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    overall_total_score: {
      type: Number,
      required: false,
    },
    overall_pass_score: {
      type: Number,
      required: false,
    },
    overall_total_topic: {
      type: Number,
      required: false,
    },
    total_question: {
      type: Number,
      required: false,
    },
    overall_correct_answer: {
      type: Number,
      required: false,
    },
    overall_incorrect_answer: {
      type: Number,
      required: false,
    },

    testresult: [testResultsSchema],
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
    timestamps: true,
  }
);

const TestTaker = mongoose.model('TestTaker', testTakerSchema);

export { TestTaker };
