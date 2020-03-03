const express = require('express');
const asyncHandler = require('express-async-handler');
const { errorHandler, notFound } = require('./middlewares');
const routes = require('./routes');

const greeting = (req, res) => res.json({ message: 'server is up and running!' });

module.exports = ({ port, database }) => {
  return express()
    .set('port', port)
    .set('db', database)
    .set('views', './src/views')
    .set('view engine', 'pug')
    .use(express.json())
    .get(
      '/',
      asyncHandler(async (req, res) => {
        const { User } = req.app.get('db').models;
        const users = await User.find();

        res.render('users', { users });
      })
    )
    .get('/api', greeting)
    .use('/api/v1', routes)
    .use(notFound)
    .use(errorHandler);
};
