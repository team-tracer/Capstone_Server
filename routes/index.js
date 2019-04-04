var express = require('express');
var passport=require("passport");
var session=require("express-session");
var fedInfo=require("../secret").federation;
var kakaoStrategy=require("passport-kakao").Strategy;
var router = express.Router();

router.use(passport.initialize());
router.get("/auth/login/kakao",passport.authenticate("login-kakao"));
passport.use("login-kakao",new kakaoStrategy({
  clientID:fedInfo.kakao.client_id,
  callbackURL: fedInfo.kakao.callback_url
},
function(accessToken, refreshToken, profile, done){
  console.log("Profile: ",profile);
  return done(null,profile);
}));

router.get("/auth/login/kakao/callback",
passport.authenticate("login-kakao",{
  successRedirect:"/",
  failureRedirect:"/login"
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Where I Am' });
});


module.exports = router;
