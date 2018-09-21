const express = require('express');

const router = new express.Router();

router.get('/dashboard', (req, res) => {
  res.status(200).json({
    username: res.user.name,
    socketId: res.user.socketId,
    message: "You're authorized to see this secret message."
  });
});

router.get('/getonlineusers', (req, res) => {
  res.status(200).json({
    usersList: res.users
  });
});

router.post('/savesocket', (req, res) => {
  res.status(200).end();
});

router.post('/logout', (req, res) => {
    res.status(200).json({
      name: res.user.name,
      socketId: res.socketId
    });
});


// TODO: call database with email as identifier or object ID
// then return the username (eventually all data needed too to chat component)

// The other way consists in registering the username in the localStorage
// via a new module (client side) named user

module.exports = router;
