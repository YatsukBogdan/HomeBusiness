const express = require('express');
const router = express.Router();
const auth = require('./auth.js')();
const ObjectId = require('mongoose').Types.ObjectId;

const invoices = require('../db.js').invoices;
const products_record = require('../db.js').products_record;
const stock = require('../db.js').stock;

router.get('/', auth.authenticate(), (req, res) => {
  if (req.user) {
    invoices.find({}).populate('client enterprenuer products.product').exec().then((_invoices) => {
      res.json({
        invoices: _invoices
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

function validate_invoice(records, stock) {
  var valid_invoice = true;
  for (var j in records) {
    var amount_less = false;
    var product_missed = true;
    for (var i in stock) {
      if (stock[i].product == records[j].product) {
        product_missed = false;
        if (stock[i].amount < records[j].amount) {
          amount_less = true;
          break;
        }
      }
    }
    if (amount_less || product_missed) {
      valid_invoice = false;
      break;
    };
  }
  return valid_invoice;
}

function validate_purchase_invoice(records, stock) {
  var valid_invoice = true;
  for (var j in records) {
    var amount_less = false;
    var product_missed = true;
    for (var i in stock) {
      console.log(stock[i]);
      console.log(records[j]);
      console.log('\n\n\n');
      if (stock[i].product == records[j].product) {
        product_missed = false;
        if (stock[i].amount + records[j].amount < 0) {
          amount_less = true;
          break;
        }
      }
    }
    if (product_missed && stock[i].amount < 0) {
      amount_less = true;
    }
    if (amount_less) {
      valid_invoice = false;
      break;
    };
  }
  return valid_invoice;
}

router.post('/', auth.authenticate(), (req, res) => {
  if (req.user) {
    console.log(req.body);
    if (req.body.products_record && req.body.enterprenuer && req.body.client && req.body.type && req.body.date) {
      if (req.body.products_record.length !== 0) {
        stock.findOne({enterprenuer: req.body.enterprenuer}).exec().then((_stock) => {
          if (req.body.type === 'sale') {

            var valid_invoice = validate_invoice(req.body.products_record, _stock.list);

            if (valid_invoice) {
              var product_record = [];
              var new_stock_list = [];
              new_stock_list = new_stock_list.concat(_stock.list);

              for (var i in req.body.products_record) {
                var product = new products_record ({
                  product: ObjectId(req.body.products_record[i].product),
                  amount: req.body.products_record[i].amount
                });
                for (var j = 0; j < new_stock_list.length; j++) {
                  if (new_stock_list[j].product.equals(req.body.products_record[i].product)) {
                    new_stock_list[j].amount -= req.body.products_record[i].amount;
                    break;
                  }
                }
                product_record.push(product);
              }

              var invoice = new invoices({
                products: product_record,
                client: req.body.client,
                enterprenuer: req.body.enterprenuer,
                date: new Date(req.body.date),
                type: req.body.type
              })

              _stock.list = new_stock_list;
              _stock.save();

              invoice.save(() => {
                res.json({
                  success: true
                });
              });
            } else {
              res.json({
                error: 'Invoice is not valid'
              });  
            }
          } else if (req.body.type === 'purchase') {
            var product_record = [];
            var new_stock_list = [];
            new_stock_list = new_stock_list.concat(_stock.list);

            for (var i in req.body.products_record) {
              var product = new products_record ({
                product: ObjectId(req.body.products_record[i].product),
                amount: req.body.products_record[i].amount
              });

              var product_processed = false;
              for (var j = 0; j < new_stock_list.length; j++) {
                console.log(new_stock_list[j]);
                console.log(req.body.products_record[i].product);
                console.log(new_stock_list[j].product.equals(req.body.products_record[i].product));
                if (new_stock_list[j].product.equals(req.body.products_record[i].product)) {
                  new_stock_list[j].amount += req.body.products_record[i].amount;
                  product_processed = true;
                  break;
                }
              }
              if (!product_processed) {
                new_stock_list.push(product);
              }

              product_record.push(product);
            }
            var invoice = new invoices({
              products: product_record,
              client: req.body.client,
              enterprenuer: req.body.enterprenuer,
              date: new Date(req.body.date),
              type: req.body.type
            })

            _stock.list = new_stock_list;
            console.log(_stock.list);
            _stock.save();
            
            invoice.save(() => {
              res.json({
                success: true
              });
            });
          }
        });
      } else {
        console.log("Bad request");
        res.json({
          error: 'Bad request'
        });  
      }
    } else {
      console.log("Bad request");
      res.json({
        error: 'Bad request'
      });  
    }
  } else {
    console.log("Broken Token");
    res.json({
      error: 'Broken Token'
    });
  }
});

router.put('/', auth.authenticate(), (req, res) => {
  if (req.user) {
    if (req.body.id && req.body.products_record && req.body.client && req.body.date) {
      if (req.body.products_record.length !== 0) {
        invoices.findOne({_id: req.body.id}).exec().then((_invoice) => {
          stock.findOne({enterprenuer: _invoice.enterprenuer}).exec().then((_stock) => {
            if (_invoice.type === 'sale') {
              var new_stock_list = [];
              new_stock_list = new_stock_list.concat(_stock.list);
              for (var i = 0; i < _invoice.products.length; i++) {
                for (var j in new_stock_list) {
                  if (_invoice.products[i].product.equals(new_stock_list[j].product)) {
                    new_stock_list[j].amount += _invoice.products[i].amount;
                    break;
                  }
                }
              }

              var valid_invoice = validate_invoice(req.body.products_record, new_stock_list);

              if (valid_invoice) {
                var product_record = [];

                for (var i in req.body.products_record) {
                  var product = new products_record ({
                    product: ObjectId(req.body.products_record[i].product),
                    amount: req.body.products_record[i].amount
                  });
                  for (var j in new_stock_list) {
                    console.log(new_stock_list[j].product.equals(req.body.products_record[i].product));
                    if (new_stock_list[j].product.equals(req.body.products_record[i].product)) {
                      new_stock_list[j].amount -= req.body.products_record[i].amount;
                      break;
                    }
                  }
                  product_record.push(product);
                }
                
                _invoice.products = product_record;
                _invoice.client = req.body.client;
                _invoice.date = new Date(req.body.date);

                _stock.list = new_stock_list;
                _stock.save();

                _invoice.save(() => {
                  res.json({
                    success: true
                  });
                });
              } else {
                res.json({
                  error: 'Invoice is not valid'
                });  
              }
            } else if (_invoice.type === 'purchase') {
              var new_stock_list = [];
              new_stock_list = new_stock_list.concat(_stock.list);

              for (var i = 0; i < _invoice.products.length; i++) {
                for (var j in new_stock_list) {
                  console.log(_invoice.products[i].product + ' = ' + new_stock_list[j].product +  ' : ');
                  console.log(typeof _invoice.products[i].product);
                  if (_invoice.products[i].product.equals(new_stock_list[j].product)) {
                    new_stock_list[j].amount -= _invoice.products[i].amount;
                    break;
                  }
                }
              }
              
              var invoice_valid = validate_purchase_invoice(req.body.products_record, new_stock_list);
              if (invoice_valid) {
                var product_record = [];

                for (var i in req.body.products_record) {
                  var product = new products_record ({
                    product: ObjectId(req.body.products_record[i].product),
                    amount: req.body.products_record[i].amount
                  });

                  var product_processed = false;
                  for (var j in new_stock_list) {
                    if (new_stock_list[j].product.equals(req.body.products_record[i].product)) {
                      new_stock_list[j].amount += req.body.products_record[i].amount;
                      product_processed = true;
                      break;
                    }
                  }
                  if (!product_processed) {
                    new_stock_list.push(product);
                  }

                  product_record.push(product);
                }
                
                _invoice.products = product_record;
                _invoice.client = req.body.client;
                _invoice.date = new Date(req.body.date);

                _stock.list = new_stock_list;
                _stock.save();

                _invoice.save(() => {
                  res.json({
                    success: true
                  });
                });
              } else {
                res.json({
                  error: 'Invoice is not valid'
                });  
              }
            }
          });
        });
      }
    } else {
      console.log("Bad request");
      res.json({
        error: 'Bad request'
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
