var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var SuppliesSchema = new Schema({
	user:{
		type: ObjectId,
    	ref: 'User'
	},
	status:{
		type:String,
		default:'未处理'
	},
	request: String,
	meta: {
	    createAt: {
	      type: Date,
	      default: Date.now()
	    }
	}
})

SuppliesSchema.pre('save', function(next) {
  next()
})

SuppliesSchema.statics = {
  fetch: function(string, cb) {
    return this
      .find()
      .sort({'meta.createAt':-1})
      .populate(string)
      .exec(cb)
  }
}

module.exports = SuppliesSchema