var mongoose = require('mongoose')
var Schema = mongoose.Schema

var TelorderSchema = new Schema({
	telnumber: String,
	request: String,
	response: String,
	serviceguy: String,
	meta: {
	    createAt: {
	      type: Date,
	      default: Date.now()
	    }
	}
})

TelorderSchema.pre('save', function(next) {
  next()
})

TelorderSchema.statics = {
  fetch: function(cb) {
    return this
    	 .find()
      .sort({'meta.createAt':-1})
      .exec(cb)
  }
}

module.exports = TelorderSchema