const express = require('express');
const users =  require('../db.js').users;
const md5 = require('md5');

const passport = require('passport');
const passportJWT = require("passport-jwt");
const config = require('./config.js');

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
var params = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function() {
  var strategy = new Strategy(params, function(data, done) {
    return users.findOne({
      _id: data.id
    }).exec().then((_user) => {
      if (_user) {
        return done(null, {
          _id: _user._id
        });
      } else {
        return done(new Error("User not found"), null);
      }
    }).catch((err) => {
      console.log("Authantication error: " + err);
    });
  });
  passport.use(strategy);
  return {
    initialize: function() {
      return passport.initialize();
    },
    authenticate: function() {
      return passport.authenticate("jwt", config.jwtSession);
    }
  };
};
