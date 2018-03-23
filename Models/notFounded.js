var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var NotFoundedSchema = new Schema({
    name: {
        type: String,
        required: 'Kindly enter the name of the task'
    }
});

module.exports = mongoose.model('NotFounded', NotFoundedSchema);