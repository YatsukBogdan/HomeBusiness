import React from 'react';
import { Table } from 'semantic-ui-react';

const StockTable = React.createClass({
  render() {
    var renderedProducts = [];
    for (var i = 0; i < this.props.stock.list.length; i++) {
      renderedProducts.push(
        <Table.Row key={i}>
          <Table.Cell>
            {i}
          </Table.Cell>
          <Table.Cell>
            {this.props.stock.list[i].product.title}
          </Table.Cell>
          <Table.Cell>
            {this.props.stock.list[i].amount}
          </Table.Cell>
        </Table.Row>
      )
    }
    return (
      <div id='stock-table'>
        <Table basic='very' celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>№</Table.HeaderCell>
              <Table.HeaderCell width={7}>Title</Table.HeaderCell>
              <Table.HeaderCell width={8}>Amount</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {renderedProducts}
          </Table.Body>
        </Table>
      </div>
    )
  }
});

export default StockTable;
