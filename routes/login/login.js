var express = require('express');
var router = express.Router();

/* GET Login page. */
router.get('/', function(req, res, next) {
  res.render('login/login', { title: 'HI ! you are in Login Page' });
});

module.exports = router;
