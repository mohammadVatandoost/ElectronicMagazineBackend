const express = require('express');
const PartModel = require('../Models/part');
const router = express.Router;

// get all parts
router.get('/',(req,res)=> {
    PartModel.find().then((parts) =>{
        res.send({parts});
    },(e) => {
        res.status(400).send(e);
    });
});
// make new part
router.post('/admin/newPart' , (req,res) => {
    let part = new PartModel({
        name: req.body.name,
        number: req.body.number,
        image: ''
    });

    part.save().then((doc) => {
        res.send(doc);
    },(e) => {
        res.status('400').send(e);
    });
});


module.exports = router ;

// module.exports = function(app) {
//     const todoList = require('../Controllers/AppController');
//
//     // todoList Routes
//     app.route('/tasks')
//         .get(todoList.list_all_tasks)
//         .post(todoList.create_a_task);
//
//
//     app.route('/tasks/:taskId')
//         .get(todoList.read_a_task)
//         .put(todoList.update_a_task)
//         .delete(todoList.delete_a_task);
// };
