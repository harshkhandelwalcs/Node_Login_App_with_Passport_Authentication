var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('welcome/welcome', { title: 'Welcome' });
});

module.exports = router;