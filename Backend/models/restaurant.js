var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restaurant = new Schema({
    image: {
        type: String
    },
    titleImage: {
        type: String
    },
    galleryImages: [{
        type: String
    }],
    name: {
        type: String
    },
    overview: {
        type: String
    },
    street: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    zip: {
        type: String
    },
    contact: {
        type: String
    },
    category: {
        type: String
    },
    price: {
        type: String
    },
    website: {
        type: String,
        default: null
    },
    facebook: {
        type: String,
        default: null
    },
    instagram: {
        type: String,
        default: null
    },
    youtube: {
        type: String,
        default: null
    },
    delivery: {
        type: Boolean
    },
    reservations: {
        type: Boolean
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
    timer: [{
        type: String
    }],
    bookings: {
        type: Number
    },
    openingDays: [{
        type: String
    }],
    startTime: [{
        type: String
    }],
    endTime: [{
        type: String
    }],
    email: {
        type: String
    },
    password: {
        type: String
    }
}, {
    collection: 'restaurants'

})

module.exports = mongoose.model('restaurant', restaurant)