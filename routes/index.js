var express = require('express');
var session=require("express-session");
var router = express.Router();
// var passport=require("passport");
// var fedInfo=require("../secret").federation;
// var kakaoStrategy=require("passport-kakao").Strategy;

// router.get("/auth/login/kakao",passport.authenticate("login-kakao"));
// passport.use("login-kakao",new kakaoStrategy({
//   clientID:fedInfo.kakao.client_id,
//   callbackURL: fedInfo.kakao.callback_url
// },
// function(accessToken, refreshToken, profile, done){
//   console.log("Profile: ",profile);
//   return done(null,profile);
// }));

// router.get("/auth/login/kakao/callback",
// passport.authenticate("login-kakao",{
//   successRedirect:"/",
//   failureRedirect:"/login"
// }));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Where I Am' });
});
router.post("/loadMap",(req,res)=>{
  console.log(req.body);
  res.send({
    "message":"Hello World!"
  });
})

module.exports = router;
