const express = require('express');
const router = express.Router();
const auth = require('./auth.js')();

const products = require('../db.js').products;

router.get('/', auth.authenticate(), (req, res) => {
  if (req.user) {
    products.find({}).exec().then((_products) => {
      res.json({
        products: _products
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
    if (req.body.title && req.body.fullTitle && req.body.purchasePrice && req.body.salePrice) {
      if (req.body.id) {
        products.update({
          _id: req.body.id
        }, {
          title: req.body.title,
          fullTitle: req.body.fullTitle,
          purchasePrice: parseFloat(req.body.purchasePrice),
          salePrice: parseFloat(req.body.salePrice)
        }).exec().then((product) => {
          res.json({
            success: true
          });
        }).catch((err) => {
          res.json({
            success: false
          });
        });
      } else {
        var product = new products({
          title: req.body.title,
          fullTitle: req.body.fullTitle,
          purchasePrice: parseFloat(req.body.purchasePrice),
          salePrice: parseFloat(req.body.salePrice)
        });
        product.save(() => {
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
      products.findOne({
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
