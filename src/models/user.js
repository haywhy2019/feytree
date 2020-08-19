import mongoose from 'mongoose';
import { Password } from '../services/password';

var registrationSchema = new Schema({
  text_field: {
    type: String,
    required: required,
  },

  field_type: {
    enum: ['TextBox', 'SelectBox', 'CheckBox', 'Calender', 'Image'],
    default: 'TextBox',
  },
  order: {
    type: Number,
  },
  mandetory: {
    type: Boolean,
  },
  verify: {
    type: Boolean,
  },
});

var tagSchema = new Schema({
  tag_field: {
    type: String,
    required: required,
  },
  question_field: {
    type: Number,
    required: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: required,
    },
    username: {
      type: String,
      required: required,
    },
    phone_number: {
      type: Number,
      required: required,
    },
    user_role: {
      type: String,
      required: required,
    },
    company_name: {
      type: String,
      required: required,
    },
    uses: {
      type: String,
      required: false,
    },
    otp: {
      type: String,
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
      default: {},
    },
    email_setting: {
      set_otp: true,
      email_digest: {
        enum: ['NEVER', 'DAILY', 'WEEKLY', 'MONTHLY'],
        default: 'NEW',
      },
      notify_candidate: true,
    },

    data_privacy: {
      explicit_content: true,
      content: {
        type: String,
      },
    },

    registration_field: [registrationSchema],

    tags: [tagSchema],

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
      required: required,
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
