'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment')
var contactSchema = new Schema({
	auth:{type:String},
	friend:{type:String},
	create_at:{type:Number},
	update_at:{type:Number}
});

module.exports = mongoose.model('contact',contactSchema);
