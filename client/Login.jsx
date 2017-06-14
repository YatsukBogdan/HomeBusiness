import React from 'react';
import { Button, Input, Segment } from 'semantic-ui-react';

const Login = React.createClass({
  authUser() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    var params = {
      method: 'POST',
      headers: { 'Content-Type':'application/x-www-form-urlencoded' },
      body: `username=${username}&password=${password}`
    };

    fetch('/login', params).then((response) => {
      return response.json();
    }).then((data) => {
      if (data.logined) {
        this.props.authUser(data.user);
        this.props.setToken(data.token);
        this.props.close();
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
      }
    }).catch((err) => {});
  },
  render() {
    return (
      <div style={{visibility: this.props.visible ? 'visible' : 'hidden'}} id='login-container'>
        <Segment color='teal' id='login-form'>
          <Input fluid placeholder='Username'>
             <input id='username' />
          </Input>
          <Input fluid placeholder='Password' type='password'>
             <input id='password'  />
          </Input>
          <Button fluid color='teal' onClick={e => this.authUser(e)}>Login</Button>
        </Segment>
      </div>
    );
  }
});

export default Login;
