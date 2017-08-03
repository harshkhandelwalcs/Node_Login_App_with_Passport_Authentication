var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
/* GET register page. */
let User = require('../../models/user');
var authenticate=require('../../controllers/authenticate_check');
router.get('/',function (req, res, next) {
  if(req.user){
    res.redirect('/welcome');
  }else{
res.render('register/register', { title: 'HI ! you are in Register Page' });
  }
  
});

//Registration Process
router.post('/', function (req, res, next) {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  //check validations

  req.checkBody('name', 'Name is Required').notEmpty();
  req.checkBody('email', 'Email is Required').notEmpty();
  req.checkBody('email', 'Email is not Valid').isEmail();
  req.checkBody('username', 'Username is Required').notEmpty();
  req.checkBody('password', 'Password is Required').notEmpty();
  req.checkBody('password2', 'Passwords Do not Match').equals(req.body.password);


  //check errors

  let errors = req.validationErrors();

  if (errors) {
    res.render('register/register', {
      title: 'HI ! you are in Register Page',
      errors: errors
    });

  } else {

    let user = new User({

      name: name,
      email: email,
      username: username,
      password: password
    });


    //Encrypt Password Using Bcrypt

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {

          console.log(err);
        }
        user.password = hash;
let query={
  email:{$ne:user.email}
}
        user.save(query,function (err) {
          if (err) {
            console.log(err);

          }
          else {

            req.flash('success', 'You are Successfully Registered ! You can Login');
            res.redirect('/login');
          }

        });
      });

    });







  }

});

module.exports = router;
