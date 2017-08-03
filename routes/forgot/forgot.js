var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var User = require('../../models/user');
var dataBase = require('../../configs/database/db');
var jwt = require('jwt-simple');
/* GET Login page. */




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
                console.log(req.user);
                req.flash('error', 'User not Found');
                res.redirect('/forgot');

            } else {
                let userData = {
                    email: user.email,
                    name: user.name,
                    id: user._id

                }
                let token = jwt.encode(userData, "H@-rsH/");
                let url = "http://localhost:3000/forgot/verification/"+token;
                let html = '<a href="'+url+'"></a>';

                sendmail(req,res,user.email,html, () => {
                    console.log("hi i am in callback");
                    res.render('sendedemailmessage/sendedemailmessge', {
                        title: "Please see your email for Reset the Password "
                    });
                });
                
            }


 

        })



    }

});

router.get('/verification/:user_token',function(req,res,next){


 var decoded = jwt.decode(req.params.user_token, "H@-rsH/");

     User.findOne({_id: decoded.id},(err,user)=>{
              if(err) throw err;
              if(!user){
                  req.flash('error','Invalid Authorization');
                  res.redirect('/login')
              }
              else{
                  console.log(user);
              }
     })
})

var sendmail = (req, res, sendTo, body, cb) => {


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
        text: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    cb();
});
    



}



module.exports = router;