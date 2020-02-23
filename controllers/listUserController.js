'use strict'

const contactModel = require('../models/contactModel');
var moment = require('moment');

var list = function(req,res) {
	var nextPageToken = req.params.nextPageToken;
	//return res.status(200).send({nextPageToken})
	req.admin.auth().listUsers(5, nextPageToken)
	    .then(function(listUsersResult) {

	      return res.status(200).send(listUsersResult);
	    })
	    .catch(function(error) {
	      	return res.status(400).send({message:error});
	    });

}
function postContact(req,res){
	var body = req.body || ""
	//res.status(200).send(typeof(body));
	if (Object.keys(body).length > 0){
			body.create_at = moment().unix();
	    body.update_at = moment().unix();
	    var nuevoContact = new contactModel(body);
	    nuevoContact.save();
	    res.status(200).send(nuevoContact);
	}
	else {
		res.status(400).send({message:"Especifica el cuerpo de la peticion."});
	}
}

function updateContact(req,res){
	var body = req.body || ""
	var _id = req.params.id

	//res.status(200).send(typeof(body));
	if (Object.keys(body).length > 0){
			body.update_at = moment().unix();
			contactModel.findOneAndUpdate({_id},body,(err,contact)=>{
				if(err) return res.status(500).send({message:`Error al realizar la solicitud razon: ${err}`})
				if(!contact) return res.status(300).send({message:'no se actualizo el registro'})
				return res.status(200).send(contact)
			})
	}
	else {
		res.status(400).send({message:"Especifica el cuerpo de la peticion."});
	}
}
function deleteContact(req,res){
	var _id = req.params.id

	//res.status(200).send(typeof(body));

	contactModel.findOneAndRemove({_id},(err,contact)=>{
		if(err) return res.status(500).send({message:`Error al realizar la solicitud razon: ${err}`})
		if(!contact) return res.status(300).send({message:'no se actualizo el registro'})
		return res.status(200).send(contact)
	})

}
function getContacts(req,res){
  var params = req.params;
  //
  var auth = params.auth;
  var receptor = params.receptor;
  var limit = Number(params.limit) || 5;
  var sort = "desc"
  var where = params.where || "";
//return res.status(200).send({params})
  if (where.length > 0)
  {
    chatModel.find({emisor,update_at:{$gt:where},receptor},(err,messages)=>{
      if(err) return res.status(500).send({message:`Error al realizar la solicitud razon: ${err}`})
      if(!messages) return res.status(200).send({})
      return res.status(200).send(messages)
    }).limit(limit)
  }
  else {
    chatModel.find({emisor,receptor},(err,messages)=>{
      if(err) return res.status(500).send({message:`Error al realizar la solicitud razon: ${err}`})
      if(!messages) return res.status(200).send({})
      return res.status(200).send(messages)
    }).limit(limit)
  }

}
module.exports = {
	list
}
