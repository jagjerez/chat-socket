'use strict'
/*
In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp 
server, but for some reason omit a client connecting to it.  I added an 
example at the bottom.
Save the following server in example.js:
*/

var net = require('net');

var path = require('path');

var express = require('express');

var app = express();

const server = net.createServer({pauseOnConnect:true},(c) => {
  // 'connection' listener
	  console.log('client connected');
	  c.on('end', () => {
	    console.log('client disconnected');
	  });
	  app.get('/',(req,res)=>{
	  		c.write('hello\r\n');
	  		console.log("peticion")
	  		//c.pipe(c);
			res.json("Solicitud completada")
		})
	  c.write('hello\r\n');
	  //c.pipe(c);
	});

server.on('error', (err) => {
  console.log(err);
});


server.getConnections((err,count)=>{
	console.log(count)
})

server.listen({
	host:'192.168.1.105',
	port:1337
	}, ()=>{
		app.listen('3000',()=>{
			console.log('servidor express escucha en el puerto 3000')
		})
		console.log('server bound',server.address())
});

