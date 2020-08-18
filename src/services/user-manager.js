import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../models/user';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';
const scryptAsync = promisify(scrypt);

export class UserManager {
  static async getVerificationToken(user, expiresIn, reason) {
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        app_role: user.app_role,
        reason: reason,
      },
      process.env.JWT_KEY,
      { expiresIn: expiresIn }
    );

    return userJwt;
  }

  static async sendMail(message) {
    let transport = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'b4d2c877970230',
        pass: '970316dcd5a041',
      },
    });
    transport.sendMail(message, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  static async sendOTP() {
    const salt = randomBytes(5);

    return salt;
  }
}
