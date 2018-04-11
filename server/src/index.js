import express    from 'express';
import path       from 'path';
import bodyParser from 'body-parser';
import morgan     from 'morgan';
import mongoose   from 'mongoose';
import config     from './config'; // get our config file
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

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// use morgan to log requests to the console

app.use(morgan('dev'));
app.use(cors());
app.use('/api', apiRoutes);

app.use('/', express.static('public'));

// Default every route except the above to serve the index.html
app.get('*',function (req, res) {
    res.redirect('/');
});
// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
