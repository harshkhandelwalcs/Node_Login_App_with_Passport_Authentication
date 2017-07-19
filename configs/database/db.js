const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/login_db');

let db=mongoose.connection;

db.on('error',function(){
console.log("error");
});

db.once('open',function(){
console.log('Connected To DataBase...');
});


module.exports=db;