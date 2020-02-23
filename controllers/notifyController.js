'use strict'
/***
******* ENVIAR NOTIFICACIONES DESDE UNA APLICACION B, A UNA APLICACION A.
***/
var notify = function(req,res) {
	let object = req.body
	if(object){
		req.io.emit(object.id,object)
		return res.json({
			message:'¡Mensaje enviado con exito!'
		})
	}
	else
		return res.status(400).json({
			message:'Debe enviar la solicitud correcta'
		})
}
module.exports = {
	notify
}