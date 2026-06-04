import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, {
        abortEarly: false,
        convert: true,
      });
      next();
    } catch (error) {
      const validationError = createHttpError(400, 'Bad Request', {
        errors: error.details.map((err) => err.message),
      });
      next(validationError);
    }
  };
};
