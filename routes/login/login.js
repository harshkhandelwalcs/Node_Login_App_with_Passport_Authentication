var express = require('express');
var router = express.Router();
var passport = require('passport');
var session=require('express-session');

/* GET Login page. */

router.get('/',function (req, res, next) {
  console.log(req.user);
if(req.user){
  res.redirect('/welcome');
}else{
  res.render('login/login', { title: 'HI ! you are in Login Page' });
}});


router.post('/', function (req, res, next) {

  passport.authenticate('local', {
    successRedirect: '/welcome',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);

})

module.exports = router;
