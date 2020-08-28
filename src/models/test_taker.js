import mongoose from 'mongoose';

var registrationSchema = new mongoose.Schema({
  text_field: {
    type: String,
    required: true,
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
});

var testResultsSchema = new mongoose.Schema({
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
});

const testTakerSchema = new mongoose.Schema(
  {
    test_id: {
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
