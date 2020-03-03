const router = require('express').Router();
const Joi = require('@hapi/joi');
const asyncHandler = require('express-async-handler');
const requestValidator = require('../middlewares/request-validator');
const { create } = require('../controllers/user.controller');

const body = Joi.object({
  name: Joi.string().required(),
  avatar: Joi.string()
    .uri()
    .required()
});

router.post('/', requestValidator({ body }), asyncHandler(create));

module.exports = router;
