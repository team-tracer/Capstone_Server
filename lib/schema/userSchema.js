const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    id: { _id:false, type: String, required: true, unique: true },
    imgSrc:{type:String},
    name: { type: String, required: true },
    friends:[{_id:false, id:{type:String, required:true }}]
});

module.exports=mongoose.model("users",userSchema);