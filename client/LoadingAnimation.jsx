import React from 'react';

const LoadingAnimation = React.createClass({
  render() {
    return (
      <div style={{visibility: this.props.visible ? 'visible' : 'hidden'}} id='loading-container'>
        <div id='loading'></div>
      </div>
    );
  }
});

export default LoadingAnimation;
