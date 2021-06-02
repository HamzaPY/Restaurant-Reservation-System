var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customer = new Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    contactNo: {
        type: String
    },
    emailAddr: {
        type: String
    },
    restName: {
        type: String
    },
    dateReserve: {
        type: String
    },
    timeReserve: {
        type: String
    },
    tableReserve: {
        type: String
    },
    status: {
        type: String
    },
    reserveUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
}, {
    collection: 'customers'

})

module.exports = mongoose.model('customer', customer)