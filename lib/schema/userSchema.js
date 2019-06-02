const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    id: { _id:false, type: String, required: true, unique: true },
    imgSrc:{type:String},
    name: { type: String, required: true },
    friends:[{_id:false, id:{type:String, required:true }}],
    isTracking:{type:Boolean, required:true, default:false},
    pos_x:{type:Number},
    pos_y:{type:Number},
    notify_token:{type:String, unique: true}
});

module.exports=mongoose.model("users",userSchema);