import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import generateToken, { getJwtSecret } from '../utils/generate.token.js';
import { generateOtp } from '../utils/generate.otp.js';
import { sendVerificationEmail } from './email.services.js';
import { emailQueue } from '../queues/email.queue.js';

class AuthService {
  async register({ email, username, password }) {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
    const verificationOtp = generateOtp();
    const user = new User({
      email,
      username,
      password: hashedPassword,
      verificationOtp,
      verificationOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await user.save();

    let emailStatus = { sent: true };

    try {
      if (process.env.NODE_ENV === 'test') {
        emailStatus = { sent: true, skipped: true };
      } else {
       await emailQueue.add('sendVerificationEmail', {
          email: user.email,
          username: user.username,
          otp: verificationOtp,
        });
      }
    } catch (emailError) {
      emailStatus = {
        sent: false,
        error: emailError.message,
      };
      console.error('Failed to send verification email:', emailError.message);
    }

    return {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      email: emailStatus,
    };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const accessToken = generateToken({ id: user._id, email: user.email, role: user.role }, '15m');
    const refreshToken = generateToken({ id: user._id, email: user.email, role: user.role }, '7d');

    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(refreshToken);
    await user.save();

    return {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh({ refreshToken }) {
    if (!refreshToken) {
      const error = new Error('Refresh token is required');
      error.statusCode = 400;
      throw error;
    }

    let payload;

    try {
      payload = jwt.verify(refreshToken, getJwtSecret());
    } catch (error) {
      const jwtError = new Error('Invalid refresh token');
      jwtError.statusCode = 401;
      throw jwtError;
    }

    const user = await User.findOne({ refreshTokens: refreshToken });

    if (!user) {
      const error = new Error('Refresh token not found');
      error.statusCode = 401;
      throw error;
    }

    const newAccessToken = generateToken({ id: user._id, email: user.email, role: user.role }, '15m');
    const newRefreshToken = generateToken({ id: user._id, email: user.email, role: user.role }, '7d');

    user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout({ refreshToken }) {
    if (!refreshToken) {
      const error = new Error('Refresh token is required');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ refreshTokens: refreshToken });

    if (!user) {
      const error = new Error('Refresh token not found');
      error.statusCode = 401;
      throw error;
    }

    user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
    await user.save();

    return {
      message: 'Logged out successfully',
    };
  }
}

const authService = new AuthService();

export default authService;
