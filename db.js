const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  passwordHash: String,
  permissions: [String],
  activeEnterprenuer: {type: Schema.Types.ObjectId, ref: 'enterprenuer'},
  name: String,
  surname: String
});

const ProductSchema = new Schema({
  title: String,
  fullTitle: String,
  purchasePrice: Number,
  salePrice: Number
});

const ProductRecordSchema = new Schema({
  product: {type: Schema.Types.ObjectId, ref: 'product'},
  amount: Number
});

const StockSchema = new Schema({
  enterprenuer: {type: Schema.Types.ObjectId, ref: 'enterprenuer'},
  list: [ProductRecordSchema]
});

const ClientSchema = new Schema({
  name: String,
  surname: String,
  location: String,
  phone: String
});

const EnterprenuerSchema = new Schema({
  name: String,
  surname: String,
  phone: String
});

const InvoiceSchema = new Schema({
  products: [ProductRecordSchema],
  client: {type: Schema.Types.ObjectId, ref: 'client'},
  enterprenuer: {type: Schema.Types.ObjectId, ref: 'enterprenuer'},
  date: Date,
  type: String
});

var connection = mongoose.connect('mongodb://localhost:27017/homebusiness');
var users = mongoose.model('user', UserSchema);
var products_record = mongoose.model('product_record', ProductRecordSchema);
var products = mongoose.model('product', ProductSchema);
var clients = mongoose.model('client', ClientSchema);
var stock = mongoose.model('stock', StockSchema);
var enterprenuers = mongoose.model('enterprenuer', EnterprenuerSchema);
var invoices = mongoose.model('invoices', InvoiceSchema);

module.exports = {
  users,
  products,
  products_record,
  clients,
  stock,
  enterprenuers,
  invoices
};
