var express = require('express');
var session=require("express-session");
var fs=require("fs");
var router = express.Router();

/* GET home page. */
router.get("/",(req,res)=>{
  res.send("hello world");
});

router.post("/post/loadMap",(req,res)=>{
  const receive_body=req.body;
  console.log("body:",receive_body);
  const obj={
    "path":"http://13.209.43.170:8000/images/"+receive_body.imgName,
    "posX": receive_body.posX,
    "posY": receive_body.posY
  }
  res.send(obj);
});

module.exports = router;
