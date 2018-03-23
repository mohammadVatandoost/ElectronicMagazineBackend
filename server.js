const  express = require('express');
const passport = require('passport');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const  mongoose = require('mongoose');
const _ = require('lodash');
const AdminRoute = require('./Route/AdminRoute') ;
const PartModel = require('./Models/part');
const ContactModel = require('./Models/contact');
const AdminModel = require('./Models/AdminModel');
const cors = require('cors');
const config = require('./config');

const app = express();
const port = process.env.PORT || config.Port;


// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(config.DBAddress);
const db = mongoose.connection;

app.use(bodyParser.json());
app.use(cors());


app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
//use sessions for tracking logins
// app.use(session({
//     secret: 'work hard',
//     resave: true,
//     saveUninitialized: false,
//     store: new MongoStore({
//         mongooseConnection: db
//     })
// }));


app.use('/admin', AdminRoute);

app.post('/contact' , (req,res) => {
    let contact = new ContactModel({
       email: req.body.email,
       message: req.body.message
    });

     contact.save().then((doc) => {
      res.send(doc);
      console.log('Successful');
    },(e) => {
      res.status('400').send(e);
       console.log('Unsuccessful');
    });
});

// get all admins
app.get('/allAdmins',(req,res) => {
    AdminModel.find().then((admins)=>{
        res.send({admins});
    }, (e) => {
        res.status(400).send(e);
    });
});


app.listen(port,() => {
    console.log('started on Port : ' + port);
});

