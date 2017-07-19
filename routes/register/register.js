var express = require('express');
var router = express.Router();

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('register/register', { title: 'HI ! you are in Register Page' });
});

module.exports = router;
