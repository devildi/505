var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var OrderSchema = new Schema({
	user:{
		type: ObjectId,
    	ref: 'User'
	},
	request: String,
	completedorNot:{
		type: Number,
    	default: 0
	},
	serviceguy: String,
	response: String,
	meta: {
	    createAt: {
	      type: Date,
	      default: Date.now()
	    },
	    updateAt: {
	      type: Date,
	      default: Date.now()
	    }
	}
})

OrderSchema.pre('save', function(next) {
  next()
})

OrderSchema.statics = {
  fetch: function(cb) {
    return this
      .find({completedorNot: 1})
      .populate('user')
      .sort({'meta.updateAt':-1})
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = OrderSchema