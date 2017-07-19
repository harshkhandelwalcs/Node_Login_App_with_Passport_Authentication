const mongoose=require('mongoose');


let userSchema=mongoose.Schema({
 name:{
     type:String,
     reqired:true
 },
  email:{
     type:String,
     reqired:true
 },
  username:{
     type:String,
     reqired:true
 },
  password:{
     type:String,
     reqired:true
 }

});

const User=module.exports=mongoose.model('User',userSchema);