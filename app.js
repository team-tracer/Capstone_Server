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
var socket_ids=[];
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
  socket.on("registerUser",(id)=>{
    console.log(id+"의 소켓 등록 완료");
    socket_ids[id]=socket.id;
  });

  socket.on("request_oppoPoint",(oppo_id)=>{
    userModel.findOne({"id":oppo_id},(err,data)=>{
      console.log(oppo_id+"의 위치를 전송합니다.");
      let obj={
        "pos_x":data.pos_x,
        "pos_y":data.pos_y
      };
      socket.emit("oppo_changed",obj);
    });
  });

  socket.on("stepDetection",async(data)=>{// id, posX, posY
    var send_id=data.id;
    var recv_id=data.oppo_id;
    var posX=data.posX;
    var posY=data.posY;
    var obj={
      "pos_x": posX,
      "pos_y": posY
    };
    console.log("상대방 아이디: "+recv_id, obj);
    await userModel.where({"id":send_id}).updateOne({"pos_x":posX, "pos_y":posY, "isTracking":true});
    if(recv_id){
      console.log(recv_id+"의 위치가 바뀌어 전송합니다.");
      io.sockets.socket(socket_ids[recv_id]).emit("oppo_changed",obj);
    }
  });

  socket.on("disconnect",(id)=>{
    userModel.findOne({"id":id},(err,res)=>{
      if(err){
        console.error(err);
        return;
      }
      //res.posX=null;
      //res.posY=null;
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
