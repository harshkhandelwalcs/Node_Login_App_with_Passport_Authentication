const LocalStrategy = require('passport-local');
const User = require('../../models/user');
const dataBase = require('../database/db');
const bcrypt = require('bcryptjs');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('../auth');

module.exports = function (passport) {

    //local strategy
    passport.use(new LocalStrategy(function (username, password, done) {
        //match Username
        let query = { username: username };
        User.findOne(query, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'No User Found' });
            }
            //match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (isMatch) {

                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect Password' });
                }
            });
        });
    }));

    //google strategy
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: '/login/auth/google/callback',
    },
        function (token, refreshToken, profile, done) {
            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function () {
                let query = {
                    email: { $ne: profile.emails[0].value }
                }
                // try to find the user based on their google id
                User.findOne(query, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        // if a user is found, log them in
                        return done(null, user);
                    } else {
                        // if the user isnt in our database, create a new user
                        var newUser = new User();
                        // set all of the relevant information
                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.name = profile.displayName;
                        newUser.email = profile.emails[0].value; // pull the first email
                        // save the user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
    passport.use(new FacebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL
    },
        // facebook will send back the token and profile
        function (token, refreshToken, profile, done) {
            // asynchronous
            process.nextTick(function () {
                // find the user in the database based on their facebook id
                User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);
                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser = new User();
                        // set all of the facebook information in our user model
                        newUser.facebook.id = profile.id; // set the users facebook id                   
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                        newUser.name = profile.name.displayName // look at the passport user profile to see how names are returned
                        if (profile.emails && profile.emails.length) {
                            newUser.email = profile.emails[0].value;
                        }
                        // facebook can return multiple emails so we'll take the first
                        // save our user to the database
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }
                });
            });
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
