import React from 'react';
import { Button } from 'semantic-ui-react';

import ProductModal from './ProductModal.jsx';

const Head = React.createClass({
  getInitialState() {
    return {
      productModalOpened: false
    }
  },
  openProductModal() {
    this.setState({
      productModalOpened: true
    });
  },
  closeProductModal() {
    this.setState({
      productModalOpened: false
    });
  },
  render() {
    return (
      <div id='products-head'>
        <Button id='products-head-button' onClick={this.openProductModal}>New Product</Button>
        <ProductModal open={this.state.productModalOpened}
                      dimmer='blurring'
                      onClose={this.closeProductModal}
                      loadProducts={this.props.loadProducts}
                      token={this.props.token}
                      new={true}/>
      </div>
    )
  }
});

export default Head;
