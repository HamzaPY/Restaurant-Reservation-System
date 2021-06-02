var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rating = new Schema({
    userTheRest: {
        type: String
    },
    rating: {
        type: Number
    },
    foodRating: {
        type: Number
    },
    serviceRating: {
        type: Number
    },
    ambienceRating: {
        type: Number
    },
    valueRating: {
        type: Number
    },
    comment: {
        type: String
    },
    userTheDate: {
        type: String
    },
    rateUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
}, {
    collection: 'ratings'

})

module.exports = mongoose.model('rating', rating)