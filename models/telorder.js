var mongoose = require('mongoose')
var TelorderSchema = require('../schemas/telorder')
var Telorder = mongoose.model('Telorder', TelorderSchema)

module.exports = Telorder