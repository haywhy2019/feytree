import mongoose from 'mongoose';

var questionsSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    option: {
      type: String,
      required: true,
    },
  },

  answers: {
    answer: {
      type: String,
      required: true,
    },
  },

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

const topicSchema = new mongoose.Schema(
  {
    topic: {
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
  }
);

const Topics = mongoose.model('Topic', topicSchema);

export { Topics };
