import React from 'react';
import { Button } from 'semantic-ui-react';

const SidePanelButton = React.createClass({
  setActiveWindow() {
    this.props.setActiveWindow(this.props.window);
  },
  render() {
    if (this.props.in_production) {
      return (
        <Button active={this.props.active == this.props.window} id='side-panel-button' fluid basic size='big' onClick={e => this.setActiveWindow(e)}>{this.props.content}</Button>
      )
    } else {
      return false;
    }
  }
});

const SidePanelButtonLogout = React.createClass({
  render() {
    return (
      <Button id='side-panel-button-logout' fluid basic color='red' size='big' onClick={this.props.logoutUser}>Logout</Button>
    )
  }
});

export {
  SidePanelButton,
  SidePanelButtonLogout
};
