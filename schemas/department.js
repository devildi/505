var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var DepartmentSchema = new Schema({
	men:[{
		type: ObjectId,
    		ref: 'user'
	}],
	name:String,
	order:[{
		type: ObjectId,
   		ref: 'Order'
	}]
})

module.exports = DepartmentSchema