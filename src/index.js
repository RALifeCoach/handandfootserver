// =======================
// get the packages we need ============
// =======================
import express    from 'express';
import bodyParser from 'body-parser';
import morgan     from 'morgan';
import mongoose   from 'mongoose';
import WebSocket  from 'ws';
import config     from './config'; // get our config file
import UserProcesses from './processes/userProcesses';
import cors       from 'cors';
import apiRoutes  from './routes/apiRoutes';
import Socket     from './utils/socket';

// =======================
// configuration =========
// =======================
const app = express();
const port = process.env.PORT || 8091;
mongoose.connect(config.database.replace('{password}', process.env.PASSWORD));
new Socket();

global.app = {superSecret: process.env.SECRET || 'RonnaSmithrim'};

const wss = new WebSocket.Server({ port: 8092 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('something');
});

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(cors());
app.get('/setup', (req, res) => {
    UserProcesses.setup()
        .then(()=>{
            res.json({success: true});
        })
        .catch(err=>{
            res.json({success: false, message: err.message});
        });
});

app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
