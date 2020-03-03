const router = require('express').Router();
const Joi = require('@hapi/joi');
const asyncHandler = require('express-async-handler');
const requestValidator = require('../middlewares/request-validator');
const { objectId, commaSeparatedValues } = require('../utils/joi-custom-schemas');
const { findByTags, create, update, remove } = require('../controllers/article.controller');

const body = Joi.object({
  userId: objectId.required(),
  title: Joi.string().required(),
  text: Joi.string().required(),
  tags: Joi.array()
    .items(Joi.string())
    .required()
});

const params = Joi.object({
  id: objectId.required()
});

const query = Joi.object({
  tags: commaSeparatedValues.required()
});

router
  .get('/', requestValidator({ query }), asyncHandler(findByTags))
  .post('/', requestValidator({ body }), asyncHandler(create))
  .put('/:id', requestValidator({ params, body }), asyncHandler(update))
  .delete('/:id', requestValidator({ params }), asyncHandler(remove));

module.exports = router;
