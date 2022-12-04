const Joi = require("joi");

const Validation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().alphanum().min(2).max(30).required(),
    lastName: Joi.string().alphanum().min(2).max(30).required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    repeat_password: Joi.ref("password"),
    organizationName: Joi.string().min(2).max(30),
    size: Joi.number().greater(1),
    organizationEmail: Joi.string().email({
      minDomainSegments: 2,
    }),
    country: Joi.string().min(2).max(30),
    state: Joi.string().min(2).max(30),
    email: Joi.string().email({
      minDomainSegments: 2,
    }),
  });
  const validation = schema.validate(data);
  return validation;
};
module.exports = { Validation };