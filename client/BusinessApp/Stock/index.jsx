import React from 'react';

import StockTable from './StockTable.jsx';

const Products = React.createClass({
  render() {
    return (
      <div className='window'>
        <StockTable stock={this.props.stock}/>
      </div>
    )
  }
});

export default Products;
