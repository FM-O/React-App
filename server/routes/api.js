const express = require('express');

const router = new express.Router();

router.get('/dashboard', (req, res) => {
  res.status(200).json({
    username: res.user.name,
    message: "You're authorized to see this secret message."
  });
});

router.get('/getonlineusers', (req, res) => {
  res.status(200).json({
    usersList: res.users
  });
});

// TODO: call database with email as identifier or object ID
// then return the username (eventually all data needed too to chat component)

// The other way consists in registering the username in the localStorage
// via a new module (client side) named user

module.exports = router;
