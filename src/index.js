// =======================
// get the packages we need ============
// =======================
import express    from 'express';
const app         = express();
import bodyParser from 'body-parser';
import morgan     from 'morgan';
import mongoose   from 'mongoose';

import { cryptPassword, comparePassword } from './utils/passwords';

import jwt        from 'jsonwebtoken'; // used to create, sign, and verify tokens
import config     from './config'; // get our config file
import User       from './models/user'; // get our mongoose model

// =======================
// configuration =========
// =======================
const port = process.env.PORT || 8080; // used to create, sign, and verify tokens
console.log(process.env);
mongoose.connect(config.database.replace('{password}', process.env.PASSWORD)); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.get('/setup', (req, res) => {
    // create a sample user
    const chris = new User({
        name: 'Chris',
        password: cryptPassword('chris@gmail.com'),
        email: 'chris@gmail.com'
    });
    const ronna = new User({
        name: 'Ronna',
        password: cryptPassword('ronna@gmail.com'),
        email: 'ronna@gmail.com'
    });
    const peter = new User({
        name: 'Peter',
        password: cryptPassword('peter@gmail.com'),
        email: 'peter@gmail.com'
    });
    const elayne = new User({
        name: 'Elayne',
        password: cryptPassword('elayne@gmail.com'),
        email: 'elayne@gmail.com'
    });
    // save the sample user
    chris.save(errChris => {
        if (errChris) throw errChris;

        console.log('Chris saved successfully');
        ronna.save(errRonna => {
            if (errRonna) throw errRonna;

            console.log('Ronna saved successfully');
            peter.save(errPeter => {
                if (errPeter) throw errPeter;

                console.log('Peter saved successfully');
                elayne.save(errElayne => {
                    if (errElayne) throw errElayne;

                    console.log('Elayne saved successfully');
                    res.json({ success: true });
                });
            });
        });
    });
});


// API ROUTES -------------------
// get an instance of the router for api routes
const apiRoutes = express.Router();

apiRoutes.post('/authenticate', (req, res) => {
    // find the user
    User.findOne({
        email: req.body.email
    }, (err, user) => {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            console.log(user);
            if (!comparePassword(req.body.password, user.password)) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
                // if user is found and password is right
                // create a token with only our given payload
                // we don't want to pass in the entire user since that has the password
                const payload = {
                    admin: user.admin
                };
                const token = jwt.sign(payload, app.get('superSecret'), {
                    expiresIn: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
});

// route middleware to verify a token
apiRoutes.use((req, res, next) => {

    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), (err, decoded) => {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', (req, res) => {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', (req, res) => {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
