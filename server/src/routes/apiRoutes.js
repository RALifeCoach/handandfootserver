import express from 'express';
import gameRoutes from "./gameRoutes";
import userRoutes from "./userRoutes";
import UserController from './../controllers/userController';
import UserProcesses from './../processes/userProcesses';
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/authenticate', (req, res) => {
    UserController.authenticate(req, res);
});

router.get('/setup', (req, res) => {
    UserProcesses.setup()
        .then(()=> res.json({success: true}))
        .catch(err=> res.json({success:false, message: err.message}));
});

// route middleware to verify a token
router.use((req, res, next) => {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        console.log('have token: ' + token);
        // verifies secret and checks exp
        jwt.verify(token, global.app.superSecret, (err, decoded) => {
            if (err) {
                console.log('&&&&&&&&&&&&&&&&&&&&: ' + err.message);
                return res.json({ success: false, type: 'reconnect', message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                req.token = token;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        console.log('No token provided');
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

router.use('/user', userRoutes);
router.use('/game', gameRoutes);

export default router;