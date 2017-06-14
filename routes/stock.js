const express = require('express');
const router = express.Router();
const auth = require('./auth.js')();

const stock = require('../db.js').stock;

router.get('/', auth.authenticate(), (req, res) => {
  if (req.user) {
    var params = {};
    if (req.query.enterprenuer) {
      params.enterprenuer = req.query.enterprenuer;
    }
    stock.findOne(params).populate('list.product').exec().then((_stock) => {
        res.json({
            stock: _stock
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

module.exports = router;
