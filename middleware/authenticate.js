const AdminModel = require('../Models/AdminModel');

const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    // if(!token) {
    //     console.log('token : ' + token);
    //     res.status(401).send();
    // }

    AdminModel.findByToken(token).then((admin) => {
        // console.log('admin : ' + admin)
        if (!admin) {
            return Promise.reject();
        }

        req.admin = admin;
        req.token = token;
        next();
    }).catch((e) => {
        // console.log('reject : ' + token);
        res.status(401).send();
    });
};

module.exports = {authenticate};
