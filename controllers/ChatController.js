'use strict'

const chatModel = require('../models/chatModel');
var moment = require('moment');

function getChat(req,res){
  var params = req.params;
  //
  var emisor = params.emisor;
  var receptor = params.receptor;
  var limit = Number(params.limit) || 5;
  var sort = "desc"
  var where = params.where || "";
//return res.status(200).send({params})
  if (where.length > 0)
  {
    chatModel.find({update_at:{$gt:where},$or:[{emisor:receptor,receptor:emisor},{emisor:emisor,receptor:receptor}]},(err,messages)=>{
      if(err) return res.status(500).send({message:`Error al realizar la solicitud razon: ${err}`})
      if(!messages) return res.status(200).send({})
      return res.status(200).send(messages)
    }).limit(limit).sort({create_at:sort})
  }
  else {
    chatModel.find({$or:[{emisor:receptor,receptor:emisor},{emisor:emisor,receptor:receptor}]},(err,messages)=>{
      if(err) return res.status(500).send({message:`Error al realizar la solicitud razon: ${err}`})
      if(!messages) return res.status(200).send({})
      return res.status(200).send(messages)
    }).limit(limit).sort({create_at:sort})
  }

}

function postMessage(req,res){
  var body = req.body || ""
  //res.status(200).send(typeof(body));
  if (Object.keys(body).length > 0){
    body.create_at = moment().unix();
    body.update_at = moment().unix();
    var nuevoMensaje = new chatModel(body);
    nuevoMensaje.save();
    req.io.emit('mensaje server ' + body.emisor,body)
    req.io.emit('mensaje server ' + body.receptor,body)
    res.status(200).send(nuevoMensaje);
  }else{
    res.status(400).send({message:"Especifica el cuerpo de la peticion."});
  }

}



module.exports = {
  getChat,
  postMessage
}
