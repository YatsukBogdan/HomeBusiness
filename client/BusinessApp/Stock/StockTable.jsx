import React from 'react';
import { Table } from 'semantic-ui-react';

const StockTable = React.createClass({
  render() {
    var renderedProducts = [];
    for (var i in this.props.products) {
      renderedProducts.push(
        <Table.Row key={i}>
          <Table.Cell>
            {i}
          </Table.Cell>
          <Table.Cell>
            {this.props.products[i].title}
          </Table.Cell>
          <Table.Cell>
            {this.props.products[i].amount}
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

export default StockTable;
