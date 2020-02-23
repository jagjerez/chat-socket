'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment')
var chatSchema = new Schema({
	mensaje:{type:String},
	emisor:{type:String},
	receptor:{type:String},
	create_at:{type:Number},
	update_at:{type:Number}
});

module.exports = mongoose.model('chat',chatSchema);
