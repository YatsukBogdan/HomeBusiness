import React from 'react';
import { Modal, Image, Button, Header, Dropdown, Input, Table } from 'semantic-ui-react';

import InvoiceHead from './InvoiceHead.jsx';

const Product = React.createClass({
  componentDidMount() {
    this.getDropdownOptions();
  },
  getInitialState() {
    return {
      options: []
    }
  },
  setProduct(ev, data) {
    this.props.setProduct(data.value, this.props.id);
  },
  getTotalPrice() {
    return parseFloat(this.props.product.price) * parseInt(this.props.product.amount);
  },
  getDropdownOptions() {
    if (this.props.type === 'sale') {
      if (this.props.stock.list.length !== 0) {
        var options = [];
        for (var i = 0; i < this.props.stock.list.length; i++) {
          options.push({
            text: this.props.stock.list[i].product.title,
            value: this.props.stock.list[i].product._id,
            description: this.props.stock.list[i].amount
          });
        }
        this.setState({options: options});
      } else {
        this.setState({
          options: []
        });
      }
    } else {
      var options = [];
      for (var i = 0; i < this.props.products.length; i++) {
        options.push({
          text: this.props.products[i].title,
          value: this.props.products[i]._id
        });
      }
      this.setState({options: options});
    }
  },
  amountOnChange(ev) {
    this.props.setAmount(ev.target.value, this.props.id);
  },
  render() {
    return (
      <Table.Row error={this.props.invalid}>
        <Table.Cell>
          <Dropdown fluid search selection noResultsMessage='There is no products lefted' options={this.state.options} onChange={this.setProduct} value={this.props.product.id}/>
        </Table.Cell>
        <Table.Cell>
          <Input fluid error={!this.props.product.amountValid} placeholder='Enter amount' value={this.props.product.amount} onChange={this.amountOnChange}/>
        </Table.Cell>
        <Table.Cell>
          {this.props.product.price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
        </Table.Cell>
        <Table.Cell>
          {this.getTotalPrice().toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
        </Table.Cell>
        <Table.Cell>
          <Button negative onClick={() => this.props.deleteProduct(this.props.id)}>Delete</Button>
        </Table.Cell>
      </Table.Row>
    );
  }
});

const InvoiceModal = React.createClass({
  componentDidMount() {
    if (!this.props.new_invoice) {
      if (this.props.invoice) {
        this.parseExistingInvoice();
        this.createFakeStock();
      }
    }
  },
  createFakeStock() {
    var fake_stock = JSON.parse(JSON.stringify(this.props.stock));
    for (var i = 0; i < this.props.invoice.products.length; i++) {
      for (var j = 0; j < fake_stock.list.length; j++) {
        if (fake_stock.list[j].product._id === this.props.invoice.products[i].product._id) {
          fake_stock.list[j].amount += this.props.invoice.products[i].amount;
        }
      }
    }
    this.setState({fake_stock: fake_stock});
  },
  getStock() {
    if (this.props.new_invoice) {
      return this.props.stock;
    } else {
      return this.state.fake_stock;
    }
  },
  parseExistingInvoice() {
    var products = [];
    for (var i = 0; i < this.props.invoice.products.length; i++) {
      products.push({
        id: this.props.invoice.products[i].product._id,
        amount: this.props.invoice.products[i].amount,
        amountValid: true,
        amountEntered: true,
        price: this.props.invoice.products[i].product[this.getInvoiceType() + 'Price']
      });
    }
    this.setState({
      client: this.props.invoice.client._id,
      products: products,
      button_enabled: true
    }, () => {
      this.getTotalPrice();
    })
  },
  getInitialState() {
    return {
      client: null,
      nextModalOpened: false,
      products: [{
        id: '',
        amount: 0,
        amountValid: true,
        amountEntered: false,
        price: 0
      }],
      total: 0,
      invalid_product_fields: [],
      button_enabled: false,
      fake_stock: null
    }
  },
  appendNewProduct() {
    this.setState({
      products: this.state.products.concat({
        id: '',
        amount: 0,
        amountValid: true,
        amountEntered: false,
        price: 0
      })
    }, () => {
      this.saveButtonControl();
    });
  },
  getInvoiceType() {
    if (this.props.new_invoice) {
      return this.props.new_invoice_type;
    } else {
      return this.props.invoice.type;
    }
  },
  getTotalPrice() {
    var sum = 0;
    for (var i in this.state.products) {
      if (this.state.products[i].amountValid) {
        sum += this.state.products[i].amount * this.state.products[i].price;
      }
    }
    this.setState({total: Math.round(sum * 100) / 100});
  },
  validateProductsDifferency() {
    var unique_ids = [];
    var invalid_ids = [];
    for (var i in this.state.products) {
      if (!unique_ids.includes(this.state.products[i].id)) {
        unique_ids.push(this.state.products[i].id);
      } else {
        invalid_ids.push(i);
      }
    }
    this.setState({
      invalid_product_fields: invalid_ids
    }, () => {
      this.saveButtonControl();
    });
  },
  deleteProduct(id) {
    var new_products = this.state.products;
    new_products.splice(id, 1);
    this.setState({products: new_products}, () => {
      this.validateProductsDifferency();
      this.getTotalPrice();
    });
  },
  setProduct(id, index) {
    var products = this.state.products;
    products[index].id = id;
    for (var i = 0; i < this.props.products.length; i++) {
      if (this.props.products[i]._id === id) {
        products[index].price = this.props.products[i][this.getInvoiceType() + 'Price'];
        break;
      }
    }
    this.setState({products: products}, () => {
      this.validateProductsDifferency();
      this.getTotalPrice();
    });
  },
  setAmount(amount, index) {
    var products = this.state.products;
    products[index].amount = amount;
    this.setState({products: products}, () => {
      this.validateAmount(index);
    });
  },
  validateAmount(index) {
    var products = this.state.products;
    var amountValid = true;
    if (/^\d+$/.test(products[index].amount)) {
      if (this.getInvoiceType() === 'sale') {
        var stock = this.getStock();
        console.log(stock);
        for (var i = 0; i < stock.list.length; i++) {        
          if (products[index].id === stock.list[i].product._id) {
            if (parseInt(products[index].amount) > stock.list[i].amount) amountValid = false;
            break;
          }
        }
      }
      if (parseInt(products[index].amount) <= 0) amountValid = false;
    } else {
      amountValid = false;
    }
    products[index].amountValid = amountValid;
    products[index].amountEntered = true;
    this.setState({
      products: products
    }, () => {
      this.saveButtonControl();
      this.getTotalPrice();
    });
  },
  setClient(client) {
    this.setState({client: client}, () => {
      this.saveButtonControl();
    });
  },
  saveButtonControl() {
    var button_enabled = true;
    for (var i in this.state.products) {
      if (!this.state.products[i].amountValid || !this.state.products[i].amountEntered) {
        button_enabled = false;
        break;
      }
    }
    if (this.state.invalid_product_fields.length !== 0) {
      button_enabled = false;
    }
    if (this.getInvoiceType() === 'sale' && this.state.client === null) {
      button_enabled = false;
    }
    this.setState({button_enabled: button_enabled});
  },
  getInvoiceClient() {
    if (this.getInvoiceType() === 'purchase') {
      return this.props.clients[0]._id;
    } else {
      return this.state.client;
    }
  },
  saveInvoice() {
    var products = [];
    for (var i in this.state.products) {
      products.push({
        product: this.state.products[i].id,
        amount: parseInt(this.state.products[i].amount)
      });
    }
    var body = {};
    if (!this.props.new_invoice) {
      body.id = this.props.invoice._id;
    }
    body.products_record = products;
    body.client = this.getInvoiceClient();
    body.enterprenuer = this.props.user.activeEnterprenuer;
    body.type = this.getInvoiceType();
    var date_string;
    if (this.props.new_invoice) {
      var date = new Date();
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      date_string = date.toISOString()
    } else {
      date_string = this.props.invoice.date;
    }
    body.date = date_string;

    var method = this.props.new_invoice ? 'POST' : 'PUT';

    var options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.props.token
      },
      body: JSON.stringify(body)
    }

    fetch('/invoices', options).then((res) => {
      this.props.loadInvoices();
      this.props.loadStock();
      this.props.onClose();
    });
  },
  renderProducts() {
    if (this.state.products.length !== 0 && this.getStock()) {
      var prods = [];
      for (var i in this.state.products) {
        prods.push(<Product stock={this.getStock()}
                            type={this.getInvoiceType()}
                            new_invoice={this.props.new_invoice}
                            invoice={this.props.invoice}
                            products={this.props.products}
                            product={this.state.products[i]}
                            setProduct={this.setProduct}
                            setAmount={this.setAmount}
                            deleteProduct={this.deleteProduct}
                            invalid={this.state.invalid_product_fields.includes(i)}
                            id={i}/>);
      }
      return prods;
    } else {
      return false;
    }
  },
  renderClient() {
    if (this.getInvoiceType() === 'sale') {
      return <InvoiceHead clients={this.props.clients}
                          client={this.state.client}
                          setClient={this.setClient}/>;
    } else {
      return false;
    }
  },
  render() {
    return (
      <Modal dimmer={this.props.dimmer} onClose={this.props.onClose} open={this.props.open}>
        <Modal.Header>{this.props.new ? ' New invoice' : 'Invoice'}</Modal.Header>
        <Modal.Content>
          {this.renderClient()}
          <Table basic='very' celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={7}>Product</Table.HeaderCell>
                <Table.HeaderCell width={3}>Amount</Table.HeaderCell>
                <Table.HeaderCell width={3}>Price</Table.HeaderCell>
                <Table.HeaderCell width={3}>Total Price</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.renderProducts()}
            </Table.Body>
          </Table>
          <div id='invoice-modal-sum-and-button'>
            <Button positive onClick={this.appendNewProduct}>Add new Product</Button>
            <p id='invoice-modal-sum'>Sum: <b>{this.state.total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</b></p>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button disabled={!this.state.button_enabled} positive onClick={this.saveInvoice}>Save</Button>
          {this.props.new ? '' : <Button negative onClick={this.openNextModal}>Delete</Button>}
          <Modal dimmer='blurring' size='small' onClose={this.closeNextModal} open={this.state.nextModalOpened}>
            <Modal.Header>Are you sure?</Modal.Header>
            <Modal.Actions>
              <Button positive onClick={this.deleteClient}>Yes</Button>
              <Button negative onClick={this.closeNextModal}>No</Button>
            </Modal.Actions>
          </Modal>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    )
  }
});

export default InvoiceModal;
