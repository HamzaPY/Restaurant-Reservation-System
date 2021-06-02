var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menu = new Schema({
    itemRest: {
        type: String
    },
    itemCategory: [{
        image: { type: String },
        name: { type: String },
        items: [{     
            itemImage: { type: String },
            itemName: { type: String },
            itemPrice: { type: String },
            itemDesc: { type: String },
        }]
    }]
}, {
    collection: 'menus'

})

module.exports = mongoose.model('menu', menu)