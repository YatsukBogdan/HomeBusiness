import React from 'react';
import { SidePanelButton, SidePanelButtonLogout } from './SidePanelButton.jsx';

const SidePanel = React.createClass({
  render() {
    return (
      <div id='side-panel'>
        <SidePanelButton content='Journal'
                         window={1}
                         setActiveWindow={this.props.setActiveWindow}
                         active={this.props.activeWindow}/>
        <SidePanelButton content='Statistics'
                         window={2}
                         setActiveWindow={this.props.setActiveWindow}
                         active={this.props.activeWindow}/>
        <SidePanelButton content='Products'
                         window={3}
                         setActiveWindow={this.props.setActiveWindow}
                         active={this.props.activeWindow}/>
        <SidePanelButton content='Clients'
                         window={4}
                         setActiveWindow={this.props.setActiveWindow}
                         active={this.props.activeWindow}/>
        <SidePanelButton content='BusinessMan'
                         window={5}
                         setActiveWindow={this.props.setActiveWindow}
                         active={this.props.activeWindow}/>
        <SidePanelButtonLogout logoutUser={this.props.logoutUser}/>
      </div>
    )
  }
});

export default SidePanel;
