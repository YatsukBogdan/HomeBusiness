import React from 'react';

import Head from './Head.jsx';
import ProductsTable from './ProductsTable.jsx';

const Products = React.createClass({
  render() {
    return (
      <div className='window'>
        <Head loadProducts={this.props.loadProducts}
              token={this.props.token}/>
        <ProductsTable products={this.props.products}
                       loadProducts={this.props.loadProducts}
                       token={this.props.token}/>
      </div>
    )
  }
});

export default Products;
