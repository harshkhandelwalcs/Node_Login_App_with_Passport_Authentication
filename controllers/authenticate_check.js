var AuthenticateController={

    ensureAuthenticated:function(req,res,next){
if(req.isAuthenticated()){

    return next();
}
else{

    req.flash('danger','Please Login');
    res.redirect('/login');
}
    }
}

module.exports=AuthenticateController;