const express = require('express');
const path = require('path');
const auth = require('./routes/auth.js')();
const bodyParser  = require('body-parser');

const app = express();

const login = require('./routes/login.js');
const user = require('./routes/user.js');
const clients = require('./routes/clients.js');
const enterprenuers = require('./routes/enterprenuers.js');
const stock = require('./routes/stock.js');
const products = require('./routes/products.js');
const invoices = require('./routes/invoices.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(auth.initialize());
app.use(express.static('client'));

app.use('/login', login);
app.use('/user', user);
app.use('/clients', clients);
app.use('/stock', stock);
app.use('/enterprenuers', enterprenuers);
app.use('/products', products);
app.use('/invoices', invoices);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Application listening on port ${PORT}`);
});
