import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { TestTaker } from './test_taker';

var registrationSchema = new mongoose.Schema(
  {
    text_field: {
      type: String,
      required: false,
    },

    field_type: {
      type: String,
      enum: ['TextBox', 'SelectBox', 'CheckBox', 'Calender', 'Image'],
      default: 'TextBox',
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

    answer_key: {
      type: Array,
      required: false,
    },

    tags: {
      type: String,
      enum: ['Easy', 'Medium', 'Harder'],
      default: 'Easy',
    },
  },
  { timestamps: true }
);

var testOptionsSchema = new mongoose.Schema(
  {
    section_name: {
      type: String,
      required: false,
    },
    topics: [
      {
        topic_name: {
          type: String,
          required: false,
        },
        topic_id: {
          type: String,
          required: false,
        },
        questions: [questionsSchema],

        correct_grade: {
          type: String,
          required: false,
        },
        incorrect_grade: {
          type: String,
          required: false,
        },
        level: {
          type: String,
          required: false,
        },
        question_type: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const testSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: false,
    },
    test_name: {
      type: String,
      required: false,
    },
    test_language: {
      type: String,
      required: false,
    },
    test_purpose: {
      type: String,
      required: false,
    },
    duration_type: {
      type: String,
      enum: ['Timed', 'Deadline'],
      default: 'Timed',
    },
    test_job_func: {
      type: String,
      required: false,
    },
    test_job_role: {
      type: String,
      required: false,
    },
    test_job_experience: {
      type: String,
      required: false,
    },
    test_job_type: {
      type: String,
      required: false,
    },
    test_job_role_2: {
      type: String,
      required: false,
    },
    level: {
      type: String,
      required: false,
    },
    assessment_type: {
      type: String,
      required: false,
    },
    question_language: {
      type: String,
      required: false,
    },
    test_duration: {
      type: String,
      required: false,
    },

    testoptions: [testOptionsSchema],
    testregistration: [registrationSchema],
    test_takers: [{ type: Schema.Types.ObjectId, ref: 'TestTaker' }],
    test_link: {
      access_time: {
        anytime: {
          type: Boolean,
          required: false,
        },
        from: {
          type: Date,
          required: false,
        },
        to: {
          type: Date,
          required: false,
        },
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
    timestamps: true,
  }
);

const CreateTest = mongoose.model('CreateTest', testSchema);

export { CreateTest };
