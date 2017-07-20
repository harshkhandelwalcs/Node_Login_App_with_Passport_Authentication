const LocalStrategy = require('passport-local');
const User = require('../../models/user');
const dataBase = require('../database/db');
const bcrypt = require('bcryptjs');


module.exports = function (passport) {

    //local strategy

    passport.use(new LocalStrategy(function (username, password, done) {

        //match Username

        let query = { username: username };

        User.findOne(query, function (err, user) {
            if (err) throw err;
            if (!user) {
                //console.log(req.user);
                return done(null, false, { message: 'No User Found' });
            }


            //match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (isMatch) {
       
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect Password' });
                }

            })
        })

    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

};
