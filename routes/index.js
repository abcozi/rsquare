var express = require('express');
var router = express.Router();
var level = require('level');
var db = level('mydb');
var path = require('path');
var stockPrice = require('../modules/stockPrice');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/landing', function(req, res, next) {
  //res.sendFile('/landing.html', { root: __dirname });
  res.render('landing',{ stockPrice:  stockPrice})
});

router.post('/login', function(req, res) {
  // req → request
  // res → response
  console.log("parsing data");
  console.log(req.body);
  var email = req.body.email; // 注意 body 是透過 input name 去抓取得唷
  var pwd = req.body.pwd;
  db.get(email, function (err, value) {
  	var flag = false;
	if (value != null){ 
		console.log("db pwd: "+value+", this pwd: "+pwd);
		if (value != pwd){
			flag = false;
			console.log(flag);
			message = "wrong password!"
			console.log(message);
			res.redirect('/');
		}
		else{
			flag = true;
			console.log(flag);
			console.log("login. email="+email+", pwd="+pwd);
			res.redirect('/landing');
		}
	  }
 	else{
		db.put(email, pwd, function (err) {
		flag = true;
		console.log(flag);
		  console.log("sign up. email="+email+", pwd="+pwd);
		});
		res.redirect('/landing');
	}
	/*
		if(flag){
			console.log("if: "+flag);
			res.redirect('/home');
		}
		else{
			console.log("if: "+flag);
			res.redirect('/'); // 跳轉到 admin
		}
	*/
	});
})
 

module.exports = router;