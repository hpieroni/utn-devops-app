const { CREATED, NO_CONTENT } = require('http-status-codes');
const { ApiError, ERRORS } = require('../utils/errors');

/**
 * Creates a new article
 *
 * @param {Object} req Express req object
 * @param {Object} res Express res object
 *
 */
async function create(req, res) {
  const { app, body } = req;
  const { Article } = app.get('db').models;
  const createdArticle = await Article.create(body);

  res.status(CREATED).json(createdArticle.toObject());
}

/**
 * Updates an existing article
 *
 * @param {Object} req Express req object
 * @param {Object} res Express res object
 *
 * @throws {ApiError}
 */
async function update(req, res) {
  const { app, body, params } = req;
  const { Article } = app.get('db').models;
  const updatedArticle = await Article.findByIdAndUpdate(params.id, body, { new: true });

  if (!updatedArticle) {
    throw new ApiError(ERRORS.NOT_FOUND);
  }

  res.json(updatedArticle.toObject());
}

/**
 * Removes an existing article
 *
 * @param {Object} req Express req object
 * @param {Object} res Express res object
 *
 * @throws {ApiError}
 */
async function remove(req, res) {
  const { app, params } = req;
  const { Article } = app.get('db').models;
  const removedArticle = await Article.findByIdAndDelete(params.id);

  if (!removedArticle) {
    throw new ApiError(ERRORS.NOT_FOUND);
  }

  res.status(NO_CONTENT).send();
}

/**
 * Find articles that contains the given tags
 *
 * @param {Object} req Express req object
 * @param {Object} res Express res object
 *
 */
async function findByTags(req, res) {
  const { app, query } = req;
  const { Article } = app.get('db').models;
  const tags = query.tags.split(',');

  const articles = await Article.find({ tags: { $elemMatch: { $in: tags } } }, '-__v');

  res.json(articles);
}

module.exports = {
  create,
  update,
  remove,
  findByTags
};
