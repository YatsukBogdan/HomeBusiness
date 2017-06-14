import React from 'react';
import { Modal, Image, Button, Header, Dropdown, Input, Table } from 'semantic-ui-react';

import InvoiceHead from './InvoiceHead.jsx';

const Product = React.createClass({
  componentDidMount() {
    this.getDropdownOptions();
  },
  getInitialState() {
    return {
      active_product: -1,
      options: [],
      amount: 0,
      amountValid: true,
      amountEntered: false
    }
  },
  componentWillReceiveProps(props) {
    this.setState({active_product: props.product.id});
  },
  setProduct(ev, data) {
    this.props.setProduct(data.value, this.props.id);
    this.setState({active_product: data.value});
  },
  getTotalPrice() {
    return parseFloat(this.getPrice()) * parseInt(this.state.amount);
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
          options: [{
            text: 'There is no products lefted'
          }]
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
  getPrice() {
    if (this.state.active_product !== -1) {
      var priceType = 'purchasePrice';
      if (this.props.type === 'sale') {
        priceType = 'salePrice'; 
      }
      for (var i = 0; i < this.props.products.length; i++) {
        if (this.state.active_product === this.props.products[i]._id) {
          return this.props.products[i][priceType];
        }
      }
    } else {
      return 0;
    }
  },
  amountOnChange(ev) {
    this.setState({
      amount: ev.target.value,
      amountEntered: true
    }, () => {
      this.validateAmount();
    });
  },
  validateAmount() {
    var amountValid = true;
    if (/^\d+$/.test(this.state.amount)) {
      for (var i = 0; i < this.props.stock.list.length; i++) {
        if (this.state.active_product === this.props.stock.list[i].product._id) {
          if (this.props.type === 'sale') {
            if (parseInt(this.state.amount) > this.props.stock.list[i].amount) amountValid = false;
          }
          if (parseInt(this.state.amount) <= 0) amountValid = false;
          break;
        }
      }
    } else {
      amountValid = false;
    }
    this.setState({
      amountValid: amountValid
    }, () => {
      this.props.setAmount(parseInt(this.state.amount), this.state.amountValid, this.state.amountEntered, this.props.id);
    });
  },
  render() {
    return (
      <Table.Row error={this.props.invalid}>
        <Table.Cell>
          <Dropdown fluid search selection options={this.state.options} onChange={this.setProduct} value={this.state.active_product}/>
        </Table.Cell>
        <Table.Cell>
          <Input fluid error={!this.state.amountValid} placeholder='Enter amount' value={this.state.amount} onChange={this.amountOnChange}/>
        </Table.Cell>
        <Table.Cell>
          {this.getPrice().toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
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
      }
    }
  },
  parseExistingInvoice() {
    var products = [];
    for (var i = 0; i < this.props.invoice.products.length; i++) {
      products.push({
        id: this.props.invoice.products[i].product._id,
        amount: this.props.invoice.products[i].amount,
        amountValid: true,
        amountEntered: true
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
        amountEntered: false
      }],
      total: 0,
      invalid_product_fields: [],
      button_enabled: false
    }
  },
  appendNewProduct() {
    this.setState({
      products: this.state.products.concat({
        id: '',
        amount: 0,
        amountValid: true,
        amountEntered: false
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
  getProductPrice(id) {
    var priceType = this.getInvoiceType() + 'Price';
    for (var i in this.props.products) {
      if (id === this.props.products[i]._id) {
        return this.props.products[i][priceType];
      }
    }
    return 0;
  },
  getTotalPrice() {
    var sum = 0;
    for (var i in this.state.products) {
      if (this.state.products[i].amountValid) {
        sum += this.state.products[i].amount * this.getProductPrice(this.state.products[i].id);
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
    this.setState({products: products}, () => {
      this.validateProductsDifferency();
      this.getTotalPrice();
    });
  },
  setAmount(amount, amountValid, amountEntered, index) {
    var products = this.state.products;
    products[index].amount = amount;
    products[index].amountValid = amountValid;
    products[index].amountEntered = amountEntered;
    this.setState({products: products}, () => {
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
        amount: this.state.products[i].amount
      });
    }
    var body = {};
    body.products_record = products;
    body.client = this.getInvoiceClient();
    body.enterprenuer = this.props.user.activeEnterprenuer;
    body.type = this.getInvoiceType();
    body.date = (new Date()).toISOString();
    var options = {
      method: 'POST',
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
    if (this.state.products.length !== 0) {
      var prods = [];
      for (var i in this.state.products) {
        prods.push(<Product stock={this.props.stock}
                            type={this.getInvoiceType()}
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
