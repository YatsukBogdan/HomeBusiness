import React from 'react';
import { Header, Image, Table } from 'semantic-ui-react';

const Invoice = React.createClass({
  componentDidMount() {
    this.getTotalPrice();
  },
  getInitialState() {
    return {
      price: 0
    }
  },
  getTotalPrice() {
    var products = this.props.invoice.products;
    var price = 0;
    var priceType = 'purchasePrice';
    if (this.props.invoice.type === 'sale') {
      priceType = 'salePrice'; 
    }
    for (var i = 0; i < products.length; i++) {
      price += products[i].product[priceType] * products[i].amount;
    }
    this.setState({price: Math.round(price * 100) / 100});
  },
  getInvoiceType() {
    if (this.props.invoice.type === 'sale') {
      return 'Sale';
    } else {
      return 'Purchase';
    }
  },
  getClientName() {
    if (this.props.invoice.type === 'sale') {
      return this.props.invoice.client.surname + ' ' + this.props.invoice.client.name;
    } else {
      return this.props.invoice.enterprenuer.surname + ' ' + this.props.invoice.enterprenuer.name;
    }
  },
  render() {
    return (
      <Table.Row onClick={() => this.props.openInvoiceModal(this.props.id)}>
        <Table.Cell>
          {this.props.id}
        </Table.Cell>
        <Table.Cell>
          {this.getInvoiceType()}
        </Table.Cell>
        <Table.Cell>
          {this.getClientName()}
        </Table.Cell>
        <Table.Cell>
          {this.state.price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
        </Table.Cell>
      </Table.Row>
    );
  }
})

const InvoicesTable = React.createClass({
  getClientName(id) {
    for (var i in this.props.clients) {
      if (id === this.props.clients[i]._id) {
        return this.props.clients[i].name
      }
    }
    return 'Unknown Client';
  },
  renderInvoices() {
    if (this.props.invoices.length !== 0) {
      var rendered_invoices = [];
      var start_date = new Date(this.props.date);
      var end_date = new Date(this.props.date);
      end_date.setDate(end_date.getDate() + 1);
      for (var i in this.props.invoices) {
        var invoice_date = new Date(this.props.invoices[i].date);
        if (invoice_date > start_date && invoice_date < end_date) {
          rendered_invoices.push(<Invoice id={i}
                                          invoice={this.props.invoices[i]}
                                          openInvoiceModal={this.props.openInvoiceModal}/>);
        }
      }
      return rendered_invoices;
    } else {
      return false;
    }
  },
  render() {
    return (
      <div id='invoces-table'>
        <Table basic='very' celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>№</Table.HeaderCell>
              <Table.HeaderCell width={3}>Type</Table.HeaderCell>
              <Table.HeaderCell width={9}>Client</Table.HeaderCell>
              <Table.HeaderCell width={3}>Total</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.renderInvoices()}
          </Table.Body>
        </Table>
      </div>
    )
  }
});

export default InvoicesTable;
