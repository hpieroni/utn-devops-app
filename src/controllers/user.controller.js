/**
 * Creates a new user
 *
 * @param {Object} req Express req object
 * @param {Object} res Express res object
 *
 */
async function create(req, res) {
  const { body, app } = req;
  const { User } = app.get('db').models;
  const createdUser = await User.create(body);

  res.status(201).json(createdUser.toObject());
}

module.exports = {
  create
};
