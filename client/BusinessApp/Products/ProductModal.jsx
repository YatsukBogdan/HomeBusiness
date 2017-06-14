import React from 'react';
import { Modal, Button, Input } from 'semantic-ui-react';

const ProductModal = React.createClass({
  getInitialState() {
    return {
      nextModalOpened: false,
      titleValue: '',
      fullTitleValue: '',
      purchasePriceValue: '',
      salePriceValue: '',
      titleValid: true,
      fullTitleValid: true,
      purchasePriceValid: true,
      salePriceValid: true,
      titleEntered: false,
      fullTitleEntered: false,
      purchasePriceEntered: false,
      salePriceEntered: false,
      saveButtonDisabled: true
    }
  },
  componentWillReceiveProps(props) {
    if (props.product) {
      this.setState({
        titleValue: props.product.title,
        fullTitleValue: props.product.fullTitle,
        purchasePriceValue: props.product.purchasePrice,
        salePriceValue: props.product.salePrice,
        titleEntered: true,
        fullTitleEntered: true,
        purchasePriceEntered: true,
        salePriceEntered: true,
        saveButtonDisabled: false
      });
    }
  },
  openNextModal() {
    this.setState({nextModalOpened: true});
  },
  closeNextModal() {
    this.setState({nextModalOpened: false});
  },
  deleteRequestParams() {
    return {
      method: 'DELETE',
      headers: {
        'Content-Type':'application/x-www-form-urlencoded',
        'Authorization': 'JWT ' + this.props.token
      },
      body: `id=${this.props.product._id}`
    };
  },
  deleteProduct() {
    fetch('/products', this.deleteRequestParams()).then((response) => {
      if (response.status == 401) {
        this.props.logoutUser();
        return Promise.reject('Unauthorized');
      }
      return response.json();
    }).then((data) => {
      this.closeNextModal();
      this.props.onClose();
      this.props.loadProducts();
    }).catch((err) => {
    });
  },
  postRequestParams() {
    var body = `title=${this.state.titleValue}&fullTitle=${this.state.fullTitleValue}&purchasePrice=${this.state.purchasePriceValue}&salePrice=${this.state.salePriceValue}`;
    if (!this.props.new) {
      body += `&id=${this.props.product._id}`
    }
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'JWT ' + this.props.token
      },
      body: body
    };
  },
  handleTitleChange(ev) {
    this.setState({
      titleValue: ev.target.value,
      titleEntered: true
    }, () => {
      this.validateTitle();
    });
  },
  validateTitle() {
    this.setState({
      titleValid: this.state.titleValue.length > 0
    }, () => {
      this.saveButtonControl();
    })
  },
  handleFullTitleChange(ev) {
    this.setState({
      fullTitleValue: ev.target.value,
      fullTitleEntered: true
    }, () => {
      this.validateFullTitle();
    });
  },
  validateFullTitle() {
    this.setState({
      fullTitleValid: this.state.fullTitleValue.length > 0
    }, () => {
      this.saveButtonControl();
    })
  },
  handlePPriceChange(ev) {
    this.setState({
      purchasePriceValue: ev.target.value,
      purchasePriceEntered: true
    }, () => {
      this.validatePPrice();
    });
  },
  validatePPrice() {
    this.setState({
      purchasePriceValid: /^\d+(\.\d+)?$/.test(this.state.purchasePriceValue)
    }, () => {
      this.saveButtonControl();
    })
  },
  handleSPriceChange(ev) {
    this.setState({
      salePriceValue: ev.target.value,
      salePriceEntered: true
    }, () => {
      this.validateSPrice();
    });
  },
  validateSPrice() {
    this.setState({
      salePriceValid: /^\d+(\.\d+)?$/.test(this.state.salePriceValue)
    }, () => {
      this.saveButtonControl();
    })
  },
  saveButtonControl() {
    if (this.state.titleValid && this.state.titleEntered &&
        this.state.fullTitleValid && this.state.fullTitleEntered && 
        this.state.purchasePriceValid && this.state.purchasePriceEntered && 
        this.state.salePriceValid && this.state.salePriceEntered) {
      this.setState({saveButtonDisabled: false});
    } else {
      this.setState({saveButtonDisabled: true});
    }
  },
  saveProduct() {
    fetch('/products', this.postRequestParams()).then((response) => {
      if (response.status == 401) {
        this.props.logoutUser();
        return Promise.reject('Unauthorized');
      }
      return response.json();
    }).then((data) => {
      this.props.onClose();
      this.props.loadProducts();
    }).catch((err) => {
      console.log(err);
    });
  },
  render() {
    return (
      <Modal dimmer={this.props.dimmer} onClose={this.props.onClose} open={this.props.open}>
        <Modal.Header>{this.props.new ? 'New product' : 'Product'}</Modal.Header>
        <Modal.Content>
          <Input fluid placeholder='Title' value={this.state.titleValue} onChange={this.handleTitleChange} error={!this.state.titleValid}>
             <input id='new-product-title' />
          </Input>
          <Input fluid placeholder='Full title' value={this.state.fullTitleValue} onChange={this.handleFullTitleChange} error={!this.state.fullTitleValid}>
             <input id='new-product-full-title' />
          </Input>
          <Input fluid placeholder='Purchase price' value={this.state.purchasePriceValue} onChange={this.handlePPriceChange} error={!this.state.purchasePriceValid}>
             <input id='new-product-purchase-price' />
          </Input>
          <Input fluid placeholder='Sale price' value={this.state.salePriceValue} onChange={this.handleSPriceChange} error={!this.state.salePriceValid}>
             <input id='new-product-sale-price' />
          </Input>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={this.saveProduct} disabled={this.state.saveButtonDisabled}>Save</Button>
          {this.props.new ? false : <Button negative onClick={this.openNextModal}>Delete</Button>}
          <Modal dimmer='blurring' size='small' onClose={this.closeNextModal} open={this.state.nextModalOpened}>
            <Modal.Header>Are you sure?</Modal.Header>
            <Modal.Actions>
              <Button positive onClick={this.deleteProduct}>Yes</Button>
              <Button negative onClick={this.closeNextModal}>No</Button>
            </Modal.Actions>
          </Modal>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    )
  }
});

export default ProductModal;
