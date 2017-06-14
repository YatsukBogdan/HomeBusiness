import React from 'react';

import Head from './Head.jsx';
import InvoicesTable from './InvoicesTable.jsx';
import InvoiceModal from './InvoiceModal/index.jsx';

const Journal = React.createClass({
  componentDidMount() {
    console.log(this.props.invoices[-1]);
  },
  getInitialState() {
    return {
      new_invoce_type: 'sale',
      current_invoice_id: -1,
      invoice_modal_opened: false,
      new_invoice: false
    }
  },
  openInvoiceModal(index) {
    console.log(index);
    console.log(this.props.invoices[index]);
    this.setState({
      invoice_modal_opened: true,
      current_invoice_id: index,
      new_invoice: false
    });
  },
  openNewInvoiceModal(type) {
    this.setState({
      invoice_modal_opened: true,
      current_invoice_id: -1,
      new_invoice: true,
      new_invoce_type: type
    });
  },
  closeInvoiceModal() {
    this.setState({
      invoice_modal_opened: false,
      current_invoice_id: -1
    });
  },
  renderInvoiceModal() {
    if (this.state.invoice_modal_opened) {
      return <InvoiceModal invoice={this.props.invoices[this.state.current_invoice_id]}
                           open={true}
                           invoice_id={this.state.current_invoice_id}
                           new_invoice={this.state.new_invoice}
                           new_invoice_type={this.state.new_invoce_type}
                           dimmer='blurring'
                           onClose={this.closeInvoiceModal}
                           clients={this.props.clients}
                           stock={this.props.stock}
                           token={this.props.token}
                           user={this.props.user}
                           loadStock={this.props.loadStock}
                           loadInvoices={this.props.loadInvoices}
                           products={this.props.products}/>;
    } else {
      return false;
    }
  },
  render() {
    return (
      <div className='window'>
        <Head openNewInvoiceModal={this.openNewInvoiceModal}/>
        <InvoicesTable openInvoiceModal={this.openInvoiceModal}
                       invoices={this.props.invoices}/>
        {this.renderInvoiceModal()}
      </div>
    )
  }
});

export default Journal;
