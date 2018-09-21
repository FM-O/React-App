const express = require('express');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');

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
app.use('/service/revoke-user', revokeUserService);

//specific routing
app.get("/*", (req, res) => {
  res.sendFile(__dirname + '/server/static/index.html');
});

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

    if (socket.handshake.query.chatpage === 'true') {
        TIMEOUT = setTimeout(() => {
            console.log("END");
        }, 10000);
    }

    socket.on('HERE', (data) => {
        console.log(data);
        clearTimeout(TIMEOUT);
        TIMEOUT = setTimeout(() => {
            console.log("END");
        }, 10000);
    });

    // console.log(socket.handshake.query);
    if (io.sockets.connected[socket.handshake.query.socketId] != undefined) {
        io.sockets.connected[socket.handshake.query.socketId].disconnect();
    }

    socket.on('USER_DISCONNECT', (data) => {
        io.emit('USER_DISCONNECTED', data.username);
        io.to(data.socketId).emit('DISCONNECT_ME');
    });

    socket.on('NEW_CONNECTION', (username) => {
        io.emit('NEW_USER_CONNECTED', username);
    });
});
