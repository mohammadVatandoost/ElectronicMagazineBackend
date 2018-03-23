const mongoose = require('mongoose');
const Part = mongoose.model('Parts');
// const Part = require('../Models/part');

exports.list_all_parts = function(req, res) {
    Part.find({}, function(err, part) {
        if (err)
            res.send(err);
        res.json(part);
    });
};




exports.create_a_part = function(req, res) {
    var new_part = new Part(req.name,req.count,'');
    new_part.save(function(err, part) {
        if (err)
            res.send(err);
        res.json(part);
    });
};


exports.read_a_part = function(req, res) {
    Part.findById(req.params.name, function(err, part) {
        if (err)
            res.send(err);
        res.json(part);
    });
};

//
// exports.update_a_task = function(req, res) {
//     Part.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };


exports.delete_a_task = function(req, res) {


    Part.remove({
        _id: req.params.taskId
    }, function(err, task) {
        if (err)
            res.send(err);
        res.json({ message: 'Task successfully deleted' });
    });
};