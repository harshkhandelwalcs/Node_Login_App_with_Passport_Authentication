var express=require('express');
var router = express.Router();

router.get('/',function(req,res,next){
    req.logout();

    req.flash('success','You are Logged out');
 res.redirect('/login');
})


module.exports=router;