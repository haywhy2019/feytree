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
      required: true,
    },
    pass_score: {
      type: Number,
      required: true,
    },

    correct_answer: {
      type: Number,
      required: true,
    },
    incorrect_answer: {
      type: Number,
      required: true,
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
      required: true,
    },
    topic_pass_score: {
      type: Number,
      required: true,
    },

    topic_total_question: {
      type: Number,
      required: true,
    },
    topic_correct_answer: {
      type: Number,
      required: true,
    },
    topic_incorrect_answer: {
      type: Number,
      required: true,
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
      required: true,
    },
    section_pass_score: {
      type: Number,
      required: true,
    },
    section_total_topic: {
      type: Number,
      required: true,
    },
    section_total_question: {
      type: Number,
      required: true,
    },
    section_correct_answer: {
      type: Number,
      required: true,
    },
    section_incorrect_answer: {
      type: Number,
      required: true,
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
      required: true,
    },
    overall_pass_score: {
      type: Number,
      required: true,
    },
    overall_total_topic: {
      type: Number,
      required: true,
    },
    total_question: {
      type: Number,
      required: true,
    },
    overall_correct_answer: {
      type: Number,
      required: true,
    },
    overall_incorrect_answer: {
      type: Number,
      required: true,
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
