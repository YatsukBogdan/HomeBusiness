import React from 'react';
import { Button } from 'semantic-ui-react';

import ClientModal from './ClientModal.jsx';

const Head = React.createClass({
  getInitialState() {
    return {
      clientModalOpened: false
    }
  },
  openClientModal() {
    this.setState({
      clientModalOpened: true
    });
  },
  closeClientModal() {
    this.setState({
      clientModalOpened: false
    });
  },
  render() {
    return (
      <div id='clients-head'>
        <Button id='clients-head-button' onClick={this.openClientModal}>New Client</Button>
        <ClientModal open={this.state.clientModalOpened}
                     dimmer='blurring'
                     onClose={this.closeClientModal}
                     loadClients={this.props.loadClients}
                     token={this.props.token}
                     new={true}/>
      </div>
    )
  }
});

export default Head;
