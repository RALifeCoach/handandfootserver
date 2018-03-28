// =======================
// get the packages we need ============
// =======================
import express    from 'express';
import bodyParser from 'body-parser';
import morgan     from 'morgan';
import mongoose   from 'mongoose';
import config     from './config'; // get our config file
import userProcesses from './processes/userProcesses';
import cors       from 'cors';
import apiRoutes  from './routes/apiRoutes';
import Socket     from './utils/socket';

// =======================
// configuration =========
// =======================
const app = express();
const port = process.env.PORT || 8091;
mongoose.connect(config.database.replace('{password}', process.env.PASSWORD));
Socket.openSocket(process.env.SOCKET_PORT || 8092);

global.app = {superSecret: process.env.SECRET || 'RonnaSmithrim'};

app.use(express.static('public'))
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(cors());
app.get('/setup', (req, res) => {
    userProcesses.setup()
        .then(()=> res.json({success: true}))
        .catch(err=> res.json({success:false, message: err.message}));
});

app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
