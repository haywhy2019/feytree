import mongoose from 'mongoose';
import { Password } from '../services/password';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: false,
    },
    phone_number: {
      type: Number,
      required: false,
    },
    user_role: {
      type: String,
      required: false,
    },
    company_name: {
      type: String,
      required: false,
    },
    uses: {
      type: String,
      required: false,
    },
    otp: {
      type: Number,
      required: false,
    },
    security_question: {
      type: String,
      required: false,
    },
    security_ans: {
      type: String,
      required: false,
    },
    test_window: {
      type: Object,
      required: false,
    },
    email_setting: {
      type: Object,
      default: {},
      required: false,
    },
    tags: {
      type: Array,
      required: false,
    },

    user_status: {
      type: String,
      required: false,
    },
    account_status: {
      type: String,
      required: false,
    },
    tmp_token: {
      type: String,
      required: false,
    },
    app_role: {
      type: String,
      required: false,
    },

    password: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }

  done();
});

const User = mongoose.model('User', userSchema);

export { User };
