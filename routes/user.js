const express = require('express');
const router = express.Router();
const auth = require('./auth.js')();

const users = require('../db.js').users;
const enterprenuers = require('../db.js').enterprenuers;

router.post('/', auth.authenticate(), (req, res) => {
  if (req.user) {
    users.findOne({
      _id: req.user._id
    }).exec().then((_user) => {
      if (_user) {
        res.json({
          logined: true,
          user: _user,
          error: null
        });
      } else {
        res.json({
          logined: false,
          error: 'User not found'
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  } else {
    console.log("Broken Token");
    res.json({
      logined: false,
      error: 'Broken Token'
    });
  }
});

module.exports = router;
