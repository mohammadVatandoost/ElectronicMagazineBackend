const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;


const AdminsSchema = new Schema({
    email: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid Email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

AdminsSchema.methods.toJSON = function () {
    let admin = this;
    let adminObj = admin.toObject();
    return _.pick(adminObj,['_id','email']);
}

AdminsSchema.methods.generateAuthToken = function () {
    let admin = this;
    let access = 'auth';
    let token = jwt.sign({_id: admin._id.toHexString(),access },'mvs1995').toString();
    admin.tokens.push({ access , token });

    return admin.save().then(() => {
        return token;
    });
    // console.log('access :' + access);
    // console.log('token :' + token);
    // console.log('generateAuthToken');
}

AdminsSchema.methods.removeToken = function (token) {
    let admin = this;

    return admin.update({
        $pull: {
            tokens: {token}
        }
    });
};

AdminsSchema.statics.findByToken = function (token) {
    let Admin = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'mvs1995');
    } catch (e) {
        return Promise.reject();
    }

    return Admin.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

AdminsSchema.statics.findByCredentials = function (email, password) {
    let Admin = this;
    console.log('findByCredentials : '+ email);
    return Admin.findOne({email: email}).then((admin) => {
        if (!admin) {
            return Promise.reject();
        }
        console.log('find email');
        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, admin.password, (err, res) => {
                if (res) {
                    resolve(admin);
                } else {
                    reject();
                }
            });
        });
    });
};


AdminsSchema.pre('save', function (next) {
    let Admin = this;

    if (Admin.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(Admin.password, salt, (err, hash) => {
                Admin.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

//authenticate input against database
// AdminsSchema.statics.authenticate = function (email, password, callback) {
//     User.findOne({ email: email })
//         .exec(function (err, adminUser) {
//             if (err) {
//                 return callback(err)
//             } else if (!adminUser) {
//                 let err = new Error('User not found.');
//                 err.status = 401;
//                 return callback(err);
//             }
//             bcrypt.compare(password, adminUser.password, function (err, result) {
//                 if (result === true) {
//                     return callback(null, adminUser);
//                 } else {
//                     return callback();
//                 }
//             })
//         });
// }

//hashing a password before saving it to the database
// AdminsSchema.pre('save', function (next) {
//     let user = this;
//     bcrypt.hash(user.password, 10, function (err, hash) {
//         if (err) {
//             return next(err);
//         }
//         user.password = hash;
//         next();
//     })
// });

module.exports = mongoose.model('AdminModel', AdminsSchema);