var express = require('express');
var session=require("express-session");
var fs=require("fs");
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
router.get("/",(req,res)=>{
  res.send("hello world");
})
router.post("/loadMap",(req,res)=>{
  const image= fs.readFileSync("public/images/highTech_1st.jpg");
  const posX=req.body.posX;
  const posY=req.body.posY;
  // const obj={
  //   "image":image,
  //   "pos_x":req.body.posX,
  //   "pos_y":req.body.posY
  // };
  console.log("test:",image,posX,posY);
  res.send({
    "map_image":image,
    "posX":posX,
    "posY":posY
  });
})

module.exports = router;
