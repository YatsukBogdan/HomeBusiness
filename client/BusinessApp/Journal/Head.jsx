import React from 'react';

import { Button } from 'semantic-ui-react';
import DatePicker from './DatePicker.jsx';

const Head = React.createClass({
  render() {
    return (
      <div id='journal-head'>
        <Button id='journal-head-button' onClick={() => this.props.openNewInvoiceModal('purchase')}>New Purchase Invoice</Button>
        <Button id='journal-head-button' onClick={() => this.props.openNewInvoiceModal('sale')}>New Sales Invoice</Button>
        <DatePicker />
      </div>
    )
  }
});

export default Head;
