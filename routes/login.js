const express = require('express');
const router = express.Router();
const md5 = require('md5');
const jwt = require("jwt-simple");
const config = require('./config.js');
const auth = require('./auth.js')();

const users = require('../db.js').users;

router.post('/', (req, res) => {
  if (req.body.username && req.body.password) {
    users.findOne({
      username: req.body.username
      //passwordHash: md5(req.body.password)
    }).exec().then((_user) => {
      if (_user) {
        var data = {
          id: _user._id
        };

        console.log("Login success");
        res.json({
          logined: true,
          user: _user,
          token: jwt.encode(data, config.jwtSecret),
          error: null
        });
      } else {
        console.log(_user + "User not found: username: " + req.body.username + ' pass: ' + md5(req.body.password));
        res.json({
          logined: false,
          error: 'User not found'
        });
      }
    });
  } else {
    console.log("Username/Password missing");
    res.json({
      logined: false,
      error: 'Username/Password missing'
    });
  }
});

module.exports = router;
