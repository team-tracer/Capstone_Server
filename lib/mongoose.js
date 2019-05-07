const mongoose=require("mongoose");
const userModel=require("./schema/userSchema");
let database;

function connectDB(){
    const dbUrl="mongodb://localhost:27017/tracer";
    mongoose.connect(dbUrl, { useNewUrlParser: true,useCreateIndex: true, })
    .then(function(){ console.log("Database is connected")})
    .catch(function(err){ console.error("mongoose connection error")});
    database = mongoose.connection;
    database.on("disconnected", function () {
        console.log("Database is disconnected, Retrying...");
        connectDB();
    });
}

module.exports={
    connectDB,
    userModel,
    database
}