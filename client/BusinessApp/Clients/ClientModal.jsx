import React from 'react';
import { Modal, Button, Input } from 'semantic-ui-react';

const ClientModal = React.createClass({
  getInitialState() {
    return {
      nextModalOpened: false,
      nameValue: '',
      surnameValue: '',
      locationValue: '',
      phoneValue: '',
      nameValid: true,
      surnameValid: true,
      locationValid: true,
      phoneValid: true,
      nameEntered: false,
      surnameEntered: false,
      locationEntered: false,
      phoneEntered: false,
      saveButtonDisabled: true
    }
  },
  componentWillReceiveProps(props) {
    if (props.client) {
      this.setState({
        nameValue: props.client.name,
        surnameValue: props.client.surname,
        locationValue: props.client.location,
        phoneValue: props.client.phone,
        nameEntered: true,
        surnameEntered: true,
        locationEntered: true,
        phoneEntered: true,
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
      body: `id=${this.props.client._id}`
    };
  },
  deleteClient() {
    fetch('/clients', this.deleteRequestParams()).then((response) => {
      if (response.status == 401) {
        this.props.logoutUser();
        return Promise.reject('Unauthorized');
      }
      return response.json();
    }).then((data) => {
      console.log(data);
      this.closeNextModal();
      this.props.onClose();
      this.props.loadClients();
    }).catch((err) => {
      console.log(err);
    });
  },
  postRequestParams() {
    var name = document.getElementById('new-client-name').value;
    var surname = document.getElementById('new-client-surname').value;
    var location = document.getElementById('new-client-location').value;
    var phone = document.getElementById('new-client-phone').value;
    var body = `name=${name}&surname=${surname}&location=${location}&phone=${phone}`;
    if (!this.props.new) {
      body += `&id=${this.props.client._id}`
    }
    return {
      method: 'POST',
      headers: {
        'Content-Type':'application/x-www-form-urlencoded',
        'Authorization': 'JWT ' + this.props.token
      },
      body: body
    };
  },
  handleNameChange(ev) {
    this.setState({
      nameValue: ev.target.value,
      nameEntered: true
    }, () => {
      this.validateName();
    });
  },
  validateName() {
    this.setState({
      nameValid: this.state.nameValue.length > 0
    }, () => {
      this.saveButtonControl();
    })
  },
  handleSurnameChange(ev) {
    this.setState({
      surnameValue: ev.target.value,
      surnameEntered: true
    }, () => {
      this.validateSurname();
    });
  },
  validateSurname() {
    this.setState({
      surnameValid: this.state.surnameValue.length > 0
    }, () => {
      this.saveButtonControl();
    })
  },
  handleLocationChange(ev) {
    this.setState({
      locationValue: ev.target.value,
      locationEntered: true
    }, () => {
      this.validateLocation();
    });
  },
  validateLocation() {
    this.setState({
      locationValid: this.state.locationValue.length > 0
    }, () => {
      this.saveButtonControl();
    })
  },
  handlePhoneChange(ev) {
    this.setState({
      phoneValue: ev.target.value,
      phoneEntered: true
    }, () => {
      this.validatePhone();
    });
  },
  validatePhone() {
    this.setState({
      phoneValid: /^\d{8,12}$/.test(this.state.phoneValue)
    }, () => {
      this.saveButtonControl();
    })
  },
  saveButtonControl() {
    if (this.state.nameValid && this.state.nameEntered &&
        this.state.surnameValid && this.state.surnameEntered && 
        this.state.locationValid && this.state.locationEntered && 
        this.state.phoneValid && this.state.phoneEntered) {
      this.setState({saveButtonDisabled: false});
    } else {
      this.setState({saveButtonDisabled: true});
    }
  },
  saveClient() {
    fetch('/clients', this.postRequestParams()).then((response) => {
      if (response.status == 401) {
        this.props.logoutUser();
        return Promise.reject('Unauthorized');
      } else {
        return response.json();
      }
    }).then((data) => {
      this.props.onClose();
      this.props.loadClients();
    }).catch((err) => {
      console.log(err);
    });
  },
  render() {
    return (
      <Modal dimmer={this.props.dimmer} onClose={this.props.onClose} open={this.props.open}>
        <Modal.Header>{this.props.new ? 'New client' : 'Client'}</Modal.Header>
        <Modal.Content>
          <Input fluid placeholder='Name' value={this.state.nameValue} onChange={this.handleNameChange} error={!this.state.nameValid}>
             <input id='new-client-name' />
          </Input>
          <Input fluid placeholder='Surname' value={this.state.surnameValue} onChange={this.handleSurnameChange} error={!this.state.surnameValid}>
             <input id='new-client-surname' />
          </Input>
          <Input fluid placeholder='Location' value={this.state.locationValue} onChange={this.handleLocationChange} error={!this.state.locationValid}>
             <input id='new-client-location' />
          </Input>
          <Input fluid placeholder='Phone' value={this.state.phoneValue} onChange={this.handlePhoneChange} error={!this.state.phoneValid}>
             <input id='new-client-phone' />
          </Input>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={this.saveClient} disabled={this.state.saveButtonDisabled}>Save</Button>
          {this.props.new ? '' : <Button negative onClick={this.openNextModal}>Delete</Button>}
          <Modal dimmer='blurring' size='small' onClose={this.closeNextModal} open={this.state.nextModalOpened}>
            <Modal.Header>Are you sure?</Modal.Header>
            <Modal.Actions>
              <Button positive onClick={this.deleteClient}>Yes</Button>
              <Button negative onClick={this.closeNextModal}>No</Button>
            </Modal.Actions>
          </Modal>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    )
  }
});

export default ClientModal;
