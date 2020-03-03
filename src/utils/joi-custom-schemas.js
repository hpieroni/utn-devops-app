const Joi = require('@hapi/joi');
const { Types } = require('mongoose');

const objectId = Joi.custom(value => {
  if (!Types.ObjectId.isValid(value)) {
    throw new Error();
  }
  return value;
}).message('must be an ObjectId');

const commaSeparatedValues = Joi.string()
  .pattern(/^([^,\s])+(,?[^,\s])*$/)
  .message('must be a string of comma separated values whitout whitespaces');

module.exports = {
  objectId,
  commaSeparatedValues
};
