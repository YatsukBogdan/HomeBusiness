import React from 'react';

import SidePanel from './SidePanel/index.jsx';

import EmptyArea from './EmptyArea.jsx';
import Journal from './Journal/index.jsx';
import Clients from './Clients/index.jsx';
import Products from './Products/index.jsx';

const BusinessApp = React.createClass({
  componentDidMount() {
    this.loadInvoices();
    this.loadProducts();
    this.loadClients();
    this.loadEnterprenuers();
    this.loadStock();
  },
  getRequestParams() {
    return {
      method: 'GET',
      headers: {
        'Content-Type':'application/x-www-form-urlencoded',
        'Authorization': 'JWT ' + this.props.token
      }
    };
  },
  loadProducts() {
    fetch('/products', this.getRequestParams()).then((response) => {
      if (response.status == 401) {
        this.props.logoutUser();
        return Promise.reject('Unauthorized');
      }
      return response.json();
    }).then((data) => {
      console.log(data);
      this.setState({
        products: data.products
      });
    }).catch((err) => {
      console.log(err);
    });
  },
  loadStock() {
    fetch('/stock?enterprenuer=' + this.props.user.activeEnterprenuer, this.getRequestParams()).then((response) => {
      if (response.status == 401) {
        this.props.logoutUser();
        return Promise.reject('Unauthorized');
      }
      return response.json();
    }).then((data) => {
      console.log(data);
      this.setState({
        stock: data.stock
      }, () => {
        this.filterStock();
      });
    }).catch((err) => {
      console.log(err);
    });
  },
  filterStock() {
    var filtered_stock_list = [];
    for (var i = 0; i < this.state.stock.list.length; i++) {
      if (this.state.stock.list[i].amount > 0) {
        filtered_stock_list.push(this.state.stock.list[i]);
      }
    }
    var stock = this.state.stock;
    stock.list = filtered_stock_list;
    this.setState({stock: stock});
  },
  loadInvoices() {
    fetch('/invoices', this.getRequestParams()).then((response) => {
      if (response.status == 401) {
        this.props.logoutUser();
        return Promise.reject('Unauthorized');
      }
      return response.json();
    }).then((data) => {
      this.setState({
        invoices: data.invoices
      });
    }).catch((err) => {
      console.log(err);
    });
  },
  loadClients() {
    fetch('/clients', this.getRequestParams()).then((response) => {
      if (response.status == 401) {
        this.props.logoutUser();
        return Promise.reject('Unauthorized');
      }
      return response.json();
    }).then((data) => {
      this.setState({
        clients: data.clients
      });
    }).catch((err) => {
      console.log(err);
    });
  },
  loadEnterprenuers() {
    fetch('/enterprenuers', this.getRequestParams()).then((response) => {
      if (response.status == 401) {
        this.props.logoutUser();
        return Promise.reject('Unauthorized');
      }
      return response.json();
    }).then((data) => {
      this.setState({
        enterprenuers: data.enterprenuers
      });
    }).catch((err) => {
      console.log(err);
    });
  },
  getInitialState() {
    return {
      activeWindow: -1,
      invoices: [],
      products: [],
      clients: [],
      enterprenuers: [],
      stock: []
    }
  },
  setActiveWindow(win) {
    this.setState({activeWindow: win});
  },
  render() {
    var activeWindow;
    switch(this.state.activeWindow) {
      case 1:
        activeWindow = <Journal invoices={this.state.invoices}
                                products={this.state.products}
                                clients={this.state.clients}
                                stock={this.state.stock}
                                token={this.props.token}
                                user={this.props.user}
                                loadInvoices={this.loadInvoices}
                                loadStock={this.loadStock}/>
        break;
      case 3:
        activeWindow = <Products products={this.state.products}
                                 token={this.props.token}
                                 loadProducts={this.loadProducts}/>
        break;
      case 4:
        activeWindow = <Clients clients={this.state.clients}
                                token={this.props.token}
                                loadClients={this.loadClients}/>
        break;
      default:
        activeWindow = <EmptyArea />;
        break;
    }
    return (
      <div>
        <SidePanel setActiveWindow={this.setActiveWindow}
                   activeWindow={this.state.active_window}
                   logoutUser={this.props.logoutUser}/>
        {activeWindow}
        <div id='window-background'></div>
      </div>
    )
  }
});

export default BusinessApp;
