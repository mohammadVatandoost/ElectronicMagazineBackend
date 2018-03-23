const express = require('express');
const _ = require('lodash');
const AdminModel = require('../Models/AdminModel');
const PartModel = require('../Models/part');
const router = express.Router();
const {authenticate} = require('../middleware/authenticate');


// register Admin
router.post('/register' , (req,res) => {
    let body = _.pick(req.body,['email','password']);
    body.email = _.toLower(body.email);
    let newAdmin = new AdminModel(body);

    newAdmin.save().then(() => {
        return newAdmin.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(newAdmin);
    }).catch((e) => {
        res.status(400).send(e);
    })
});
//login Admin
router.post('/login' , (req,res) => {
    const body = _.pick(req.body, ['email', 'password']);
    body.email = _.toLower(body.email);
    // console.log(body);
    AdminModel.findByCredentials(body.email, body.password).then((admin) => {
        console.log('generateAuthToken');
        return admin.generateAuthToken().then((token) => {
            console.log('x-auth');
            // console.log(admin);
            res.header('x-auth', token).send(token);
        });
    }).catch((e) => {
         // console.log('error :'+e);
         res.status(400).send();
    });
    // AdminModel.authenticate(req.body.email,req.body.password, function (error,adminUser) {
    //     if(error || !adminUser) {
    //         let err =  new error('email or password is not correct');
    //         err.status(401);
    //         return next(err);
    //     } else {
    //         req.session.adminId = adminUser._id;
    //
    //     }
    // });
});
// find my self
router.get('/me', authenticate, (req, res) => {
    res.send(req.admin);
});
// logout
router.post('/logout', authenticate, (req, res) => {
    req.admin.removeToken(req.header('x-auth')).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});
// POST /users
// app.post('/users', (req, res) => {
//     var body = _.pick(req.body, ['email', 'password']);
//     var user = new User(body);
//
//     user.save().then(() => {
//         return user.generateAuthToken();
//     }).then((token) => {
//         res.header('x-auth', token).send(user);
//     }).catch((e) => {
//         res.status(400).send(e);
//     })
// });


//
// app.post('/users/login', (req, res) => {
//     var body = _.pick(req.body, ['email', 'password']);
//
//     User.findByCredentials(body.email, body.password).then((user) => {
//         return user.generateAuthToken().then((token) => {
//             res.header('x-auth', token).send(user);
//         });
//     }).catch((e) => {
//         res.status(400).send();
//     });
// });




module.exports = router;