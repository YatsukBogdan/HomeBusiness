import React from 'react';
import ReactDOM from 'react-dom';

import Login from './Login.jsx';
import LoadingAnimation from './LoadingAnimation.jsx';
import BusinessApp from './BusinessApp/index.jsx';

const App = React.createClass({
  getInitialState() {
    return {
      isAuthorized: false,
      user: {},
      token: null,
      loginVisible: true,
      loadingVisible: true
    }
  },
  componentDidMount() {
    if (localStorage.getItem('token')) {
      var token = localStorage.getItem('token');
      this.setState({token: token});
      var jwtHeader = new Headers();
      jwtHeader.append('Authorization', 'JWT ' + token);

      var params = {
        method: 'POST',
        headers: jwtHeader
      };

      fetch('/user', params).then((response) => {
        if (response.status == 401) {
          this.closeLoading();
          return Promise.reject('Unauthorized');
        }
        return response.json();
      }).then((data) => {
        if (data.logined) {
          this.authUser(data.user);
          this.closeLoginForm();
        }
        this.closeLoading();
      }).catch((err) => {
        console.log(err);
      });
    } else {
      this.closeLoading();
    }
  },
  authUser(user) {
    this.setState({
      isAuthorized: true,
      user: user
    });
  },
  setToken(token) {
    localStorage.setItem('token', token);
    this.setState({token: token});
  },
  logoutUser() {
    this.setState({
      isAuthorized: false,
      user: {},
      loginVisible: true,
    });
    this.deleteToken();
  },
  deleteToken() {
    localStorage.removeItem('token');
    this.setState({
      token: null
    });
  },
  closeLoading() {
    this.setState({loadingVisible: false});
  },
  openLoginForm() {
    this.setState({loginVisible: true});
  },
  closeLoginForm() {
    this.setState({loginVisible: false});
  },
  renderBusinessApp() {
    if (this.state.isAuthorized && this.state.token && this.state.user) {
      return <BusinessApp logoutUser={this.logoutUser}
                          user={this.state.user}
                          token={this.state.token}/>;
    } else {
      return false;
    }
  },
  render() {
    return (
      <div>
        <LoadingAnimation visible={this.state.loadingVisible}/>
        <Login authUser={this.authUser}
               visible={this.state.loginVisible}
               close={this.closeLoginForm}
               setToken={this.setToken}/>
        {this.renderBusinessApp()}
      </div>
    )
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
