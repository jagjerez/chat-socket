'use strict'

var userModel = require('../models/userModel')
var tokenModel = require('../models/tokenModel')
var jwt = require('jsonwebtoken')
var moment = require('moment')
var Crypto = require('crypto-js')
var signIn = function(req,res){
	let user = req.body
	if(Object.keys(user) <= 0){
		return res.status(401).send({message:'user or password is incorrect.'})
	}
	if(!user.username || !user.password){
		return res.status(401).send({message:'user or password is incorrect.'})
	}
	
	//let expire = moment().unix()
	//return res.status(200).send(Crypto.SHA256(user.password.toString()).toString());
	userModel.findOne({username:user.username,password:Crypto.SHA256(user.password.toString()).toString()},(err,docs)=>{
		if(err) return res.status(500).send({message:'error.'})
		if(!docs) return res.status(401).send({message:'user or password is incorrect.'})

		let token = jwt.sign({user:docs},'5178fa42f1*',{expiresIn:"20m"})
		let objToken = new tokenModel({token})
		objToken.save()
		return res.status(200).send({token})
	})
	//jwt.sign({user,iat:moment().unix()})
}

var signUp = function(req,res){
	let user = req.body
	if(Object.keys(user) <= 0){
		return res.status(500).send({message:'Error al realizar la peticion'})
	}
	if(!user.username || !user.password){
		return res.status(500).send({message:'debe especificar un usuario y contraseña.'})
	}
	userModel.findOne({username:user.username},(err,doc)=>{
		if(err) return res.status(500).send({message:'Error al realizar la peticion'})
		if(doc) return res.status(500).send({message:'Este usuario ya existe.'})
		user.password = Crypto.SHA256(user.password.toString()).toString()
		let _user = new userModel(user)
		_user.validate((err)=>{
			if(err) return res.status(500).send({message:`Error al registrar el usuario, mensaje ${err}`})
			_user.save()
			return res.status(200).send(_user)
		})
	})
	
}

var confirmUser = function(req,res){
	//return res.send(req.auth)
	let user = req.body
	if(Object.keys(user) <= 0){
		return res.status(500).send({message:'Error al realizar la peticion'})
	}
	if(!user.username){
		return res.status(500).send({message:'debe especificar un usuario y contraseña.'})
	}
	userModel.updateOne({username:user.username},{confirmed:true},(err,_res)=>{
		if(err) return res.status(500).send({message:'Error al realizar la peticion'})
		if(_res.nModified > 0){
			return res.status(200).send({message:'datos actualizados'})
		}
		else
		{
			return res.status(304).send({message:'datos no actualizados'})
		}
	})
}

var logOut = function(req,res){
	let headerAuthorization = req.headers.authorization
	if(!headerAuthorization) return res.status(500).send({message:'Debe colocar una cabecera de autorizacion.'})
	if(!(headerAuthorization.split(" ")[0] === "Bearer")) return res.status(500).send({message:'Solo se admite autorizacion Bearer.'})
	if(!(headerAuthorization.split(" ")[1] === "undefined" || headerAuthorization.split(" ")[1])) return res.status(500).send({message:'Debes colocar un token valido.'})
	tokenModel.deleteOne({token:headerAuthorization.split(" ")[1]},(err,doc)=>{
		if(err) return res.status(500).send({message:`error al realizar la solicitud, razon ${err}`})
		if(doc.deletedCount <= 0)return res.status(401).send({message:'Error al cerrar la session'})
		return res.status(200).send({message:'logOut success'})
	})
}

module.exports = {
	signIn,
	signUp,
	logOut,
	confirmUser
}