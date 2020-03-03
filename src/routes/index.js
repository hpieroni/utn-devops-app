const router = require('express').Router();

router.use('/users', require('./user.route'));
router.use('/articles', require('./article.route'));

module.exports = router;
