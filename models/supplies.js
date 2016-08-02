var mongoose = require('mongoose')
var SuppliesSchema = require('../schemas/supplies')
var Supplies = mongoose.model('Supplies', SuppliesSchema)

module.exports = Supplies