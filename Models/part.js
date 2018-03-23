const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PartSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    number: {
      type: Number,
      required: true
    },
    image: {
        type: String,
        required: true
    },
    footprint: {
        type: String,
        required: true
    },
    dataSheet: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Parts', PartSchema);