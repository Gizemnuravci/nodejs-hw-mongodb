import { isHttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  const status = isHttpError(err) ? err.status : 500;
  const message = isHttpError(err) ? err.message : 'Something went wrong';

  res.status(status).json({
    status,
    message,
    ...(status === 500 && { data: err.message }),
  });
};
