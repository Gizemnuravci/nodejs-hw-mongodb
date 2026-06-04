import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { sendEmail } from './email.js';

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

const createSessionData = () => {
  return {
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });

  const userObj = newUser.toObject();
  delete userObj.password;
  return userObj;
};

export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Unauthorized');
  }

  const isConfirmed = await bcrypt.compare(password, user.password);
  if (!isConfirmed) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteMany({ userId: user._id });

  return await SessionsCollection.create({
    userId: user._id,
    ...createSessionData(),
  });
};

export const refreshSession = async ({ refreshToken, sessionId }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionsCollection.deleteOne({ _id: session._id });

  return await SessionsCollection.create({
    userId: session.userId,
    ...createSessionData(),
  });
};

export const logoutUser = async ({ sessionId, refreshToken }) => {
  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
};

export const sendResetEmail = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Reset password',
    html: `<p>Reset your password by clicking this link:</p><a href="${resetLink}">${resetLink}</a>`,
  });
};

export const resetPassword = async ({ token, password }) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await UsersCollection.findOne({ email: decoded.email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  await SessionsCollection.deleteMany({ userId: user._id });
};
