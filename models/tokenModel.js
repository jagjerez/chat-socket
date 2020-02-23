'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment')
var tokenSchema = new Schema({
	token:{type:String,unique:true,required:true},
	create_at:{type:Number,default:moment().unix()}
});

module.exports = mongoose.model('token',tokenSchema);