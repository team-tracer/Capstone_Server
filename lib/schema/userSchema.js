const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    id: { type: String, unique:true },
    imgSrc:{type:String},
    name: { type: String },
    friends:[{_id:false, id:{type:String }}],
    isTracking:{type:Boolean, default:false},
    pos_x:{type:Number, default:0},
    pos_y:{type:Number, default:0},
    notify_token:{type:String, unique: true}
});

module.exports=mongoose.model("users",userSchema);
