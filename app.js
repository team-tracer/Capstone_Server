var createError = require('http-errors');
var passport=require("passport");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose=require("./lib/mongoose");
var socketio=require("socket.io");
var getRouter=require("./routes/get");
var postRouter = require('./routes/post');
var app = express();

var userModel=mongoose.userModel;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/get', getRouter);
app.use('/post',postRouter);
app.get("/hi",(req,res)=>{
  res.send("hi");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
server=app.listen(8000,()=>{
  console.log("Succeses connection: 8000");
  mongoose.connectDB();
})

var io=socketio.listen(server);
io.sockets.on('connection',(socket)=>{
  console.log("소켓연결이 되었습니다.");

  socket.on("stepDetection",async(data)=>{// id, posX, posY
    var userID=data.id;
    var posX=data.posX;
    var posY=data.posY;
    var user=await userModel({"id":userID});
    if(user){
      console.log("initial: x= "+posX+" y= "+posY);
      user.isTracking=true;
      user.pos_x=posX;
      user.pos_y=posY;
      user.save();
    }else{
      console.log("해당 유저가 없습니다.");
    }
  });

  socket.on("disconnect",(id)=>{
    userModel.findOne({"id":id},(err,res)=>{
      if(err){
        console.error(err);
        return;
      }
      res.posX=null;
      res.posY=null;
      res.isTracking=false;
    });
  });

  socket.on("error",(id)=>{
    console.log(id+" is error");
  });

});
io.sockets.on("disconnection",function(){
  console.log("소켓연결이 끊어졌습니다.")
});

module.exports = app;
