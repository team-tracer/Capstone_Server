var express = require('express');
var mongoose = require("../lib/mongoose");
var session = require("express-session");
var fs = require("fs");
var router = express.Router();

let userModel = mongoose.userModel;

router.get("/loadFrd",async(req,res,next)=>{
    const userID=req.query.id;
    let friendList=[];
    let obj=[];
    let user=await userModel.findOne({"id":userID});
    if(user){
        for(let i=0; i<user.friends.length; i++){
            friendList.push(user.friends[i].id);
        }
        for(let i=0; i<friendList.length; i++){
            let oppoUser=await userModel.findOne({"id":friendList[i]});
            if(oppoUser){
                obj.push({
                    "profile_image":oppoUser.imgSrc,
                    "nickname":oppoUser.name,
                    "userID":oppoUser.id,
		    "token":oppoUser.notify_token
                });
            }
        }
        if(obj){
	    console.log(obj);
            res.send(obj);
        }
    }
    res.end();
});
module.exports= router;
