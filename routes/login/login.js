var express = require('express');
var router = express.Router();
var passport = require('passport');
var session = require('express-session');

/* GET Login page. */

router.get('/', function (req, res, next) {
  console.log(req.user);
  if (req.user) {
    res.redirect('/welcome');
  } else {
    res.render('login/login', { title: 'HI ! you are in Login Page' });
  }
});


router.post('/', function (req, res, next) {

  passport.authenticate('local', {
    successRedirect: '/welcome',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);

})


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/auth/google/callback',

  passport.authenticate('google', {
    successRedirect: '/welcome',
    failureRedirect: '/login'
  }));

router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/welcome',
    failureRedirect: '/login'
  }));





module.exports = router;
