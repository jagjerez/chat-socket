'use strict'

var jwt = require('jsonwebtoken')
//var tokenModel = require('../models/tokenModel')
var moment = require('moment')
var request = require('request')
var atob = require('atob');
var Crypto = require('crypto-js')
var admin = require('firebase-admin');
var config = require('../firebaseConfig');
admin.initializeApp({
  credential: admin.credential.cert({
  "type": "service_account",
  "project_id": process.env.project_id,
  "private_key_id": process.env.private_key_id,
  "private_key": process.env.private_key,
  "client_email": "firebase-adminsdk-nb3co@chat-29efa.iam.gserviceaccount.com",
  "client_id": "100434186098101938972",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.client_x509_cert_url
}),
  databaseURL: "https://chat-29efa.firebaseio.com"
});




var verificarToken = async function(req,res,next) {
	let headerAuthorization = req.headers.authorization

	if(!headerAuthorization) return res.status(500).send({message:'Debe colocar una cabecera de autorizacion.'})
	if(!(headerAuthorization.split(" ")[0] === "Bearer")) return res.status(500).send({message:'Solo se admite autorizacion Bearer.'})
	if(!(headerAuthorization.split(" ")[1] === "undefined" || headerAuthorization.split(" ")[1])) return res.status(500).send({message:'Debes colocar un token valido.'})
	//var credential = firebase.auth.GoogleAuthProvider.credential(headerAuthorization.split(" ")[1]);

	admin.auth().verifyIdToken(headerAuthorization.split(" ")[1],true)
	  .then(function(decodedToken) {
	  	admin.auth().getUser(decodedToken.sub).then((user)=>{
	  			if(!user.emailVerified) return res.status(401).send({message:'El usuario no esta verificado.'})
				if(user.disabled) return res.status(401).send({message:'El usuario no esta disponible.'})
				req.admin = admin
		  		next()
		  	}).catch((err)=>{
				return res.status(401).send(err)
			})
	    
	    // ...
	  }).catch(function(error) {
	    // Handle error
	    return res.status(401).send(error)
	  });

	/*var url = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
	
	request({
	    url: url,
	    json: true
	}, function (error, response, body) {

	    if (!error && response.statusCode === 200) {
				
				var hola = JSON.parse(atob(headerAuthorization.split(" ")[1].split(".")[0]))
				var payload = JSON.parse(atob(headerAuthorization.split(" ")[1].split(".")[1]))
				payload.iat = new Date(payload.iat*1000).toString()
				//return res.status(200).send(payload)

				jwt.verify(headerAuthorization.split(" ")[1],body[hola.kid],async (err,decoded)=>{
					
					
					admin.auth().getUser(decoded.sub).then((user)=>{
						if(!user) return res.status(401).send({message:'El usuario no existe.'})
						if(!user.emailVerified) return res.status(401).send({message:'El usuario no esta verificado.'})
						if(user.disabled) return res.status(401).send({message:'El usuario no esta disponible.'})
						var f1 = new Date().toString()
						var f2 = new Date(decoded.exp*1000).toString() 
						//return res.status(200).send(f2)
						if(f1 <= f2){
							return res.status(200).send(user)
						}else{
							return res.status(401).send({message:'El token no es valido'})
						}
						
					}).catch((err)=>{
						return res.status(401).send(err)
					})

					
				})
				
	    }
	    else{
	    	return res.status(401).send(err)
	    }
	})*/
	//base64UrlEncode(headerAuthorization.split(" ")[1].split(".")[])
	  
	//return res.send(headerAuthorization.split(" ")[1])
	/*tokenModel.findOne({token:headerAuthorization.split(" ")[1]},(err,doc)=>{
		if(err) return res.status(500).send({message:'error.'})
		if(!doc) return res.status(401).send({message:'token invalid.'})
		jwt.verify(doc.token,'5178fa42f1*',async (_err,decode)=>{
			if(_err) {
				return await tokenModel.deleteOne({token:doc.token},(__err)=>{
					if(__err) return res.status(500).send({message:`error al realizar la solicitud, razon:${__err}`})
					return res.status(401).send({message:`Error al realizar la peticion razon, ${_err}`})
				})
				
			}

			if(!(decode.user.role === "admin")) return res.status(401).send({message:'No tienes permisos'})
			req.auth = decode.user
			next()	
		})
	})*/
	
	
}

module.exports = verificarToken