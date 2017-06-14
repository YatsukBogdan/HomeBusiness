const express = require('express');
const router = express.Router();
const auth = require('./auth.js')();

const enterprenuers = require('../db.js').enterprenuers;
const stock = require('../db.js').stock;

router.get('/', auth.authenticate(), (req, res) => {
  if (req.user) {
    var params = {};
    if (req.query.id) {
      params._id = req.query.id;
    }
    console.log(req.query);
    enterprenuers.find(params).exec().then((_enterprenuers) => {
      res.json({
        enterprenuers: _enterprenuers
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
    if (req.body.name && req.body.surname && req.body.phone) {
      if (req.body.id) {
        enterprenuers.update({
          _id: req.body.id
        },{
          name: req.body.name,
          surname: req.body.surname,
          phone: req.body.phone
        }).exec().then((enterprenuer) => {
          res.json({
            success: true
          });
        }).catch((err) => {
          res.json({
            success: false
          });
        });
      } else {
        var enterprenuer = new enterprenuers({
          name: req.body.name,
          surname: req.body.surname,
          phone: req.body.phone
        });
        
        enterprenuer.save((err, ent) => {
          var en_stock = new stock({
            list: [],
            enterprenuer: ent.id
          });
          en_stock.save();
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

module.exports = router;
