import React from 'react';

import Head from './Head.jsx';
import ClientsTable from './ClientsTable.jsx';

const Clients = React.createClass({
  render() {
    return (
      <div className='window'>
        <Head loadClients={this.props.loadClients}
              token={this.props.token}/>
        <ClientsTable clients={this.props.clients}
                      loadClients={this.props.loadClients}
                      token={this.props.token}/>
      </div>
    )
  }
});

export default Clients;
