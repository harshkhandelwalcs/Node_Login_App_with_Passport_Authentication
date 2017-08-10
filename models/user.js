const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    name: {
        type: String,
        reqired: true
    },
    email: {
        type: String,
        reqired: true
    },
    username: {
        type: String,
        reqired: true
    },
    password: {
        type: String,
        reqired: true
    },
    google: {
        id: String,
        token: String
    },
    facebook: {
        id: String,
        token: String
    }
});

const User = module.exports = mongoose.model('User', userSchema);