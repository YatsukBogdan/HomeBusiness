import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const InvoiceHead = React.createClass({
  componentDidMount() {
    var clientsOptions = [];
    this.props.clients.forEach((client) => {
      clientsOptions.push({
        key: client.name,
        value: client._id,
        text: client.surname + ' ' + client.name
      });
    });
    this.setState({
      clientsOptions: clientsOptions
    });
  },
  getInitialState() {
    return {
      clientsOptions: []
    }
  },
  setClient(ev, data) {
    this.props.setClient(data.value);
  },
  render() {
    return (
      <div>
        <Dropdown placeholder='Clients' search selection options={this.state.clientsOptions} onChange={this.setClient}/>
      </div>
    )
  }
});

export default InvoiceHead;
