const express = require('express');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');
const request = require('request');
const cookieParser = require('cookie-parser');

// Connect to the database and load models
require('./server/models').connect(config.dbUri);

const app = express();
// tell the app to look for static files in these directories
app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));

// tell the app to parse http body messages
app.use(bodyParser.urlencoded({ extended: false }));

// pass the passport middleware
app.use(passport.initialize());

// pass the cookieParser middleware
app.use(cookieParser());

// Load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// Pass the authentication checker middleware
const authCheckMiddleware = require('./server/middleware/auth-check');
const getOnlineUsersMiddleware = require('./server/middleware/get-online-users');
const setOfflineUserMiddleware = require('./server/middleware/set-user-offline');
const saveSocketMiddleware = require('./server/middleware/save-socket');

app.use('/api', authCheckMiddleware);
app.use('/api/getonlineusers', getOnlineUsersMiddleware);
app.use('/api/savesocket', saveSocketMiddleware);
app.use('/api/logout', setOfflineUserMiddleware);

//routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

//services
const revokeUserService = require('./server/services/revoke-user');
const generateAccessTokenService = require('./server/services/generate-access-token');
app.use('/service/revoke-user', revokeUserService);
app.use('/service/token', generateAccessTokenService);

//specific routing
// app.get("/*", (req, res) => {
//     console.log("ok1");
//   res.send(__dirname + '/server/static/index.html');
// });

// start the server
const server = app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000 or http://127.0.0.1:3000');
});

const io = socket(server);

io.on('connection', (socket, data) => {
    let TIMEOUT = null;

    socket.on('SEND_MESSAGE', function (data) {
        io.emit('RECEIVE_MESSAGE', data);
    });

    socket.on('HERE', (data) => {
        console.log(data);
        clearTimeout(TIMEOUT);
        TIMEOUT = setTimeout(() => {
            console.log(data.socket);
            request.post({url: 'http://10.53.37.209:3000/service/revoke-user', form: {socketId: data.socket}, json: true, headers: {'Authorization': `${config.apiKey}`}}, (err, res, body) => {
                if (err) { return console.log("BIGERROR : " + err); }
                if (res.statusCode === 401) { return console.log('requestError : ' + body) };
                console.log(body);
                io.emit('USER_TIMEOUT', {username: body, reason: 'ping timeout'});
            });
        }, 10000);
    });

    socket.on('EXIT', () => {
        clearTimeout(TIMEOUT);
    });

    if (io.sockets.connected[socket.handshake.query.socketId] != undefined) {
        console.log(socket.handshake.query);
        console.log(io.sockets.connected[socket.handshake.query.socketId].id);
        io.sockets.connected[socket.handshake.query.socketId].disconnect();
    }

    socket.on('USER_DISCONNECT', (data) => {
        io.emit('USER_DISCONNECTED', {username: data.username, reason: 'client exited'});
    });

    socket.on('NEW_CONNECTION', (username) => {
        io.emit('NEW_USER_CONNECTED', username);
    });
});
