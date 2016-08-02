var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  employeeID:{
    unique: true,
    type: String
  },
  floor: String,
  housenumber: Number,
  deparment: String,
  ip: String,
  mac: String,
  phonenumber: String,
  role: {
    type: Number,
    default: 0
  },
  BeFixed:[{
    type: ObjectId,
    ref: 'Order'
  }],
  HasFixed:[{
    type: ObjectId,
    ref: 'Order'
  }],
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
UserSchema.pre('save',function(next){
  this.meta.createAt = Date.now()
  next()
})

UserSchema.methods = {

}

UserSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = UserSchema