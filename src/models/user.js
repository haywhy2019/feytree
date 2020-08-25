import mongoose from 'mongoose';
import { Password } from '../services/password';

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

var tagSchema = new mongoose.Schema({
  tag_field: {
    type: String,
    required: true,
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
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    phone_number: {
      type: Number,
      required: true,
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
      set_otp: {
        type: Boolean,
        default: true,
      },
      email_digest: {
        type: String,
        enum: ['NEVER', 'DAILY', 'WEEKLY', 'MONTHLY'],
        default: 'NEVER',
      },
      notify_candidate: {
        type: Boolean,
        default: true,
      },
    },

    data_privacy: {
      explicit_content: {
        type: Boolean,
        default: true,
      },
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
      required: true,
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
