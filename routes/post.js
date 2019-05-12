var express = require('express');
var mongoose = require("../lib/mongoose");
var session = require("express-session");
var fs = require("fs");
var router = express.Router();

let userModel = mongoose.userModel;

/* GET home page. */
router.post("/signup", async (req, res, next) => {
  const userID = req.body.userID;
  const name = req.body.nickName;
  const imgSrc = req.body.imgSrc;

  try {
    const result = await userModel.findOne({ id: userID });
    if (!result) {
      let register_user = new userModel();
      register_user.id = userID;
      register_user.name = name;
      register_user.imgSrc = imgSrc;
      register_user.save();
      console.log("ID: " + userID + "is not here We are trying to save your ID");
    }
  } catch (err) {
    console.error("ID:" + userID + "Searching err");
    return console.error(err);
  }
  res.end();
});

router.post("/userDrop", async (req, res, next) => {
  const userID = req.body.userID;
  const result = await userModel.deleteOne({ id: userID });
  if (result) {
    console.log(userID + "is delete");
  } else {
    console.log(userID + " is not here");
  }
  res.end();
});

router.post("/loadMap", (req, res) => {
  const receive_body = req.body;
  console.log("body:", receive_body);
  const obj = {
    "path": "http://13.209.43.170:8000/images/" + receive_body.imgName,
    "posX": receive_body.posX,
    "posY": receive_body.posY
  }
  res.send(obj);
});

router.post("/acceptFrd", async (req, res, next) => {
  const receive_body = req.body;
  console.log(receive_body); // fromID가 친구요청한 사람, toID가 친구요청 받은 사람
  let obj = {};
  if (receive_body.fromID === receive_body.toID) {
    console.log("same ID so return");
    obj.type = 500;
    res.send(obj);
    res.end();
    return;
  }
  let fromUser = await userModel.findOne({ "id": receive_body.fromID });
  if (fromUser) {
    if (fromUser.friends.length === 0) {
      fromUser.friends.push({ id: receive_body.toID });
      fromUser.save();
      obj.fromName = fromUser.name;
      obj.type = 200;
    } else {
      for (let i = 0; i < fromUser.friends.length; i++) {
        if (fromUser.friends[i].id === receive_body.toID) {
          console.log("1already here");
          obj.type = 404;
          break;
        }
        if (i == fromUser.friends.length - 1) {
          fromUser.friends.push({ id: receive_body.toID });
          fromUser.save();
          obj.fromName = fromUser.name;
          obj.type = 200;
        }
      }
    }
  }
  let toUser = await userModel.findOne({ "id": receive_body.toID });
  if (toUser) {
    if (toUser.friends.length === 0) {
      toUser.friends.push({ id: receive_body.fromID });
      toUser.save();
      obj.toName = toUser.name;
      obj.type = 200;
    }
    else {
      for (let i = 0; i < toUser.friends.length; i++) {
        if (toUser.friends[i].id === receive_body.fromID) {
          obj.type = 404;
          console.log("2already here");
          break;
        }
        if (i == toUser.friends.length - 1) {
          toUser.friends.push({ id: receive_body.fromID });
          toUser.save();
          obj.toName = toUser.name;
          obj.type = 200;
        }
      }
    }
  }
  console.log("obj: ", obj);
  res.send(obj);
  res.end();
});

router.post("/delFrd",async(req,res,next)=>{
  let user=await userModel.findOne({"id":req.body.userID});
  const delUser=req.body.delID;
  if(user){
    let friends=user.friends;
    for(let id in friends){
      if(id===delUser){
        user.friends.splice(id, 1);
        user.save()
        .then(()=>{
          console.log(delUser, "user delete!");
        })
        .catch(()=>{
          console.error("delUser error");
        })
      }
    }
  }else{
    console.log(delUser," is not here");
  }
  res.end();
});

module.exports = router;