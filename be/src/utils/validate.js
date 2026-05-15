const AppError = require('./AppError');

/**
 * Helper that turns a Joi schema into Express middleware. Validation
 * failures throw a 400 with the field-level breakdown.
 */
module.exports = function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { value, error } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return next(
        new AppError(
          'Validation failed',
          400,
          error.details.map((d) => ({ path: d.path.join('.'), msg: d.message })),
        ),
      );
    }
    req[source] = value;
    return next();
  };
};
