import React from 'react';
import { Table } from 'semantic-ui-react';

import ProductModal from './ProductModal.jsx';

const ProductsTable = React.createClass({
  getInitialState() {
    return {
      products: [],
      currentProduct: -1,
      productModalOpened: false
    }
  },
  openProductModal(index) {
    this.setState({
      productModalOpened: true,
      currentProduct: index
    });
  },
  closeProductModal(index) {
    this.setState({
      productModalOpened: false,
      currentProduct: -1
    });
  },
  render() {
    var renderedProducts = [];
    for (var i = 0; i < this.props.products.length; i++) {
      renderedProducts.push(
        <Table.Row key={i} onClick={this.openProductModal.bind(this, i)}>
          <Table.Cell>
            {i}
          </Table.Cell>
          <Table.Cell>
            {this.props.products[i].title}
          </Table.Cell>
          <Table.Cell>
            {this.props.products[i].fullTitle}
          </Table.Cell>
          <Table.Cell>
            {this.props.products[i].purchasePrice}
          </Table.Cell>
          <Table.Cell>
            {this.props.products[i].salePrice}
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
              <Table.HeaderCell width={5}>Title</Table.HeaderCell>
              <Table.HeaderCell width={6}>Full title</Table.HeaderCell>
              <Table.HeaderCell width={2}>Purchase price</Table.HeaderCell>
              <Table.HeaderCell width={2}>Sale price</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {renderedProducts}
          </Table.Body>
        </Table>
        <ProductModal open={this.state.productModalOpened}
                      dimmer='blurring'
                      onClose={this.closeProductModal}
                      product={this.props.products[this.state.currentProduct]}
                      new={false}
                      loadProducts={this.props.loadProducts}
                      token={this.props.token}/>
      </div>
    )
  }
});

export default ProductsTable;
