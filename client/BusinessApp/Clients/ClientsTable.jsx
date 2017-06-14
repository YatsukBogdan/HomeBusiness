import React from 'react';
import { Table } from 'semantic-ui-react';

import ClientModal from './ClientModal.jsx';

const ClientsTable = React.createClass({
  getInitialState() {
    return {
      clients: [],
      currentClient: -1,
      clientModalOpened: false
    }
  },
  openClientModal(index) {
    this.setState({
      clientModalOpened: true,
      currentClient: index
    });
  },
  closeClientModal(index) {
    this.setState({
      clientModalOpened: false,
      currentClient: -1
    });
  },
  render() {
    var renderedClients = [];
    for (var i = 0; i < this.props.clients.length; i++) {
      renderedClients.push(
        <Table.Row key={i} onClick={this.openClientModal.bind(this, i)}>
          <Table.Cell>
            {i}
          </Table.Cell>
          <Table.Cell>
            {this.props.clients[i].name}
          </Table.Cell>
          <Table.Cell>
            {this.props.clients[i].surname}
          </Table.Cell>
          <Table.Cell>
            {this.props.clients[i].location}
          </Table.Cell>
          <Table.Cell>
            {this.props.clients[i].phone}
          </Table.Cell>
        </Table.Row>
      )
    }
    return (
      <div id='clients-table'>
        <Table basic='very' celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>№</Table.HeaderCell>
              <Table.HeaderCell width={3}>Name</Table.HeaderCell>
              <Table.HeaderCell width={4}>Surname</Table.HeaderCell>
              <Table.HeaderCell width={5}>Location</Table.HeaderCell>
              <Table.HeaderCell width={3}>Phone</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {renderedClients}
          </Table.Body>
        </Table>
        <ClientModal open={this.state.clientModalOpened}
                     dimmer='blurring'
                     onClose={this.closeClientModal}
                     client={this.props.clients[this.state.currentClient]}
                     new={false}
                     loadClients={this.props.loadClients}
                     token={this.props.token}/>
      </div>
    )
  }
});

export default ClientsTable;
