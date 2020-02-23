'use strict'

var userModel = require('../models/userModel')

function verificar(req,res,next){
	let user = req.body
	if(Object.keys(user) <= 0){
		return res.status(401).send({message:'user or password is incorrect.'})
	}
	if(!user.username || !user.password){
		return res.status(401).send({message:'user or password is incorrect.'})
	}
	userModel.findOne({username:user.username},(err,docs)=>{
		if(err) return res.status(500).send({message:`Error en el middleware ${err}`})
		if(!docs) return res.status(401).send({message:'user or password is incorrect.'})
		if(!docs.confirmed) return res.status(401).send({message:`Usuario no confirmado ${docs.username}`})
		next()
		
	})
}

module.exports = verificar