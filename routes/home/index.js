var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
if(req.user){
      res.redirect('/welcome');
}else{
      res.render('home/index', { title: 'Welcome In My APP' });
}


});

module.exports = router;
