import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  sendResetEmail,
  resetPassword,
} from '../services/auth.js';

const setupCookies = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const registerUserController = async (req, res) => {
  const data = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshSessionController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const session = await refreshSession({ refreshToken, sessionId });

  setupCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (sessionId) {
    await logoutUser({ sessionId, refreshToken });
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};

export const sendResetEmailController = async (req, res) => {
  await sendResetEmail(req.body.email);

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
