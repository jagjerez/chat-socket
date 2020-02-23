'use strict'
/*
In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp
server, but for some reason omit a client connecting to it.  I added an
example at the bottom.
Save the following server in example.js:
*/


const dotenv = require ('dotenv');
dotenv.config (); 
var path = require('path');
var mongoose = require('mongoose')
var express = require('express');
var app = express();
var http = require('http').createServer(app)
var io = require('socket.io')(http);
var routeNotify = require('./routes/notify')
var routeLogin = require('./routes/login')
var routeUsers = require('./routes/listUsers')
var routeChat = require('./routes/Chat')
var bodyParser = require('body-parser')
var history = require('connect-history-api-fallback');
app.use(history());
io.set('origins', '*:*');
io.on('connect',(socket)=>{
  console.log("hola")
})


console.log(`${process.env.SERVER_MONGO_DEV}`)
mongoose.connect(`${process.env.SERVER_MONGO_DEV}`,
	{useUnifiedTopology: true,useNewUrlParser: true,user:`${process.env.USER_MONGO}`,pass:`${process.env.PASSWORD_MONGO}`},(err,db)=>{
		http.listen(process.env.PORT_DEV,`${process.env.local_url}`, function(){
		  console.log(`listening on  ${process.env.local_url}:${process.env.PORT_DEV}`);
		});
	});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',(s)=>{
	console.log('conexion abierta') 
})
console.log(__dirname + '\\public\\vuejs');
app.use(express.static(__dirname + '/public/vuejs'));
/*app.use('/angular', (req, res) => {
	console.log("aqui")
	res.sendFile(path.join(__dirname, '/public/angular/index.html'))
  })*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use((req,res,next)=>{

	req.db = db;
	next()
})

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));



app.use((req,res,next)=>{
	req.io = io;
	next()
})

app.use('/notify',routeNotify)
app.use('/auth',routeLogin)
app.use('/list',routeUsers)
app.use('/chat',routeChat)
