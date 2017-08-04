var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var User = require('../../models/user');
var dataBase = require('../../configs/database/db');
var jwt = require('jwt-simple');
var bcrypt = require('bcryptjs');
/* GET Login page. */
var data='';
router.get('/', function (req, res, next) {
    res.render('enteremail/enteremail');
});


router.post('/email', function (req, res, next) {
    req.checkBody('email', 'Email is Required').notEmpty();
    req.checkBody('email', 'Email is not Valid').isEmail();

    let errors = req.validationErrors();

    if (errors) {
        res.render('enteremail/enteremail', {
            title: 'HI ! you are in Register Page',
            errors: errors
        });
    } else {
        User.findOne({ email: req.body.email }, function (err, user) {
            if (err) throw err;
            if (!user) {
      
                req.flash('error', 'User not Found');
                res.redirect('/forgot');
            } else {
                let userData = {
                    email: user.email,
                    name: user.name,
                    id: user._id

                }
                let token = jwt.encode(userData, "H@-rsH/");
           

                sendmail(req, res, user.email,token, () => {
                    console.log("hi i am in callback");
                    res.render('sendedemailmessage/sendedemailmessge', {
                        title: "Please see your email for Reset the Password "
                    });
                });
            }
        })
    }
});

//verify Token
router.get('/verification/:user_token', function (req, res, next) {

    var decoded = jwt.decode(req.params.user_token, "H@-rsH/");
    data=decoded;
    console.log(data,data);
    User.findOne({ _id: decoded.id }, (err, user) => {
        if (err) throw err;
        if (!user) {
            req.flash('error', 'Invalid Authorization');
            res.redirect('/login');
        }
        else {
         
            //   req.flash('success','Set Your New Password');
            res.render('resetpassword/resetpassword', {
                title: 'Set Your New Password'
            });
        }
    })
});

//Send mail function
var sendmail = (req, res, sendTo,token, cb) => {

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: "harshkhandelwalcs@gmail.com",
            pass: "qwert123@"
        }
    });
    let mailOptions = {
        from: '"Forgot Password 👻" <hkcs1995@gmail.com>', // sender address
        to: sendTo,
        subject: 'Forgot Password',
        html: '<p>Hi ! For reset your password Please Click the link below. Click <a href="http://localhost:3000/forgot/verification/' + token + '">http://localhost:3000/forgot/verification/' + token + '</a></p>'

    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        cb();
    });

}

//set New Password
router.post('/reset', (req, res, next) => {
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;

    req.checkBody('password', 'Password is Required').notEmpty();
    req.checkBody('confirmpassword', 'Passwords Do not Match').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
        res.render('resetpassword/resetpassword', {
            title: 'Set Your New Password',
            errors: errors
        });

    } else {
        //Encrypt Password Using Bcrypt

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) {

                    console.log(err);
                }
                password = hash;
                User.update({ _id: data.id }, {
                    $set: { password: password }}, function(err, result) {
if(err){
    req.flash('error','User not Registerd! Please Registered First');
    res.redirect('/forgot/reset');
}else{
    req.flash('success','Your Password is Update! You can  Log In')
    res.redirect('/login');
}
                    })
            })
        })


    }
});
module.exports = router;