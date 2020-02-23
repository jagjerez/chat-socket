'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment')
var userSchema = new Schema({
	username:{type:String,unique:true,required:true},
	password:{type:String,required:true},
	confirmed:{type:Boolean,default:false},
	role:{type:String,default:'user'},
	nombres:{type:String,default:'',required:true},
	create_at:{type:Number,default:moment().unix()},
	update_at:{type:Number,default:moment().unix()}
});

module.exports = mongoose.model('user',userSchema);