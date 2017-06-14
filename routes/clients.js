const express = require('express');
const router = express.Router();
const auth = require('./auth.js')();

const clients = require('../db.js').clients;

router.get('/', auth.authenticate(), (req, res) => {
  if (req.user) {
    clients.find({}).exec().then((_clients) => {
      res.json({
        clients: _clients
      });
    }).catch((err) => {
      console.log(err);
    });
  } else {
    console.log("Broken Token");
    res.json({
      error: 'Broken Token'
    });
  }
});

router.post('/', auth.authenticate(), (req, res) => {
  if (req.user) {
    if (req.body.name && req.body.surname && req.body.location && req.body.phone) {
      if (req.body.id) {
        clients.update({
          _id: req.body.id
        },{
          name: req.body.name,
          surname: req.body.surname,
          location: req.body.location,
          phone: req.body.phone
        }).exec().then((client) => {
          res.json({
            success: true
          });
        }).catch((err) => {
          res.json({
            success: false
          });
        });
      } else {
        var client = new clients({
          name: req.body.name,
          surname: req.body.surname,
          location: req.body.location,
          phone: req.body.phone
        });
        client.save((err) => {
          res.json({
            success: true
          });
        });
      }
    }
  } else {
    console.log("Broken Token");
    res.json({
      error: 'Broken Token'
    });
  }
});


router.delete('/', auth.authenticate(), (req, res) => {
  if (req.user) {
    if (req.body.id) {
      clients.findOne({
        _id: req.body.id
      }).remove().exec().then(() => {
        res.json({
          success: true
        });
      }).catch((err) => {
        res.json({
          success: false,
          error: err
        });
      });
    }
  } else {
    console.log("Broken Token");
    res.json({
      error: 'Broken Token'
    });
  }
});

module.exports = router;
