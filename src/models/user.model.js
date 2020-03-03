const { Schema } = require('mongoose');
const Joi = require('@hapi/joi');

module.exports = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator: val => {
          const { error } = Joi.string()
            .uri()
            .validate(val);
          return !error;
        },
        message: 'Invalid url'
      }
    }
  },
  { toObject: { versionKey: false } }
);
