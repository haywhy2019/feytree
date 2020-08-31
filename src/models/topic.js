import mongoose from 'mongoose';

var questionsSchema = new mongoose.Schema(
  {
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

const topicSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: false,
    },
    user_id: {
      type: String,
      required: false,
    },

    questions: [questionsSchema],
    allocated_mark: {
      type: Number,
      required: false,
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

const Topics = mongoose.model('Topic', topicSchema);

export { Topics };
