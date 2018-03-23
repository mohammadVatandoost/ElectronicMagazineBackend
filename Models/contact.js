const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ContactSchema = new Schema({
    email: {
        type: String,
        required: 'Kindly enter the name of the task'
    },
    message: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Contact', ContactSchema);