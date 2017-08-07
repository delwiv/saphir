import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
// import LoginForm from 'components/LoginForm/LoginForm';
// import FacebookLogin from 'components/FacebookLogin/FacebookLogin';
import * as authActions from 'redux/modules/auth';
import * as notifActions from 'redux/modules/notifs';
import { Button } from 'react-mdl';

@connect(
  state => ({ user: state.auth.user, twitchUrl: state.auth.twitchUrl }),
  { ...notifActions, ...authActions })
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    twitchUrl: PropTypes.string,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    notifSend: PropTypes.func.isRequired
  }

  static defaultProps = {
    user: null,
    twitchUrl: null
  }

  static contextTypes = {
    router: PropTypes.object
  }

  componentWillReceiveProps(nextProps) {
    console.log({ nextProps })
    if (nextProps.twitchUrl) {
      console.log(nextProps.twitchUrl)
      window.open(nextProps.twitchUrl, 'Login with Twitch')
    }
  }

//  onFacebookLogin = (err, data) => {
//    if (err) return;
//    this.props.login('facebook', data, false)
//      .then(this.successLogin)
//      .catch(error => {
//        if (error.message === 'Incomplete oauth registration') {
//          this.context.router.push({
//            pathname: '/register',
//            state: { oauth: error.data }
//          });
//        }
//      });
//  };

  login = data => this.props.login('local', data).then(this.successLogin);

  successLogin = data => {
    this.props.notifSend({
      message: 'You\'r logged !',
      kind: 'success',
      dismissAfter: 2000
    });
    return data;
  };

//  FacebookLoginButton = ({ facebookLogin }) => (
//    <Button
//      raised
//      ripple
//      onClick={facebookLogin}
//      style={{
//        backgroundColor: '#3b5998',
//        color: '#ffffff'
//      }}
//    >
//      Login with <i className="fa fa-facebook-f" />
//    </Button>
//  );

  render() {
    const { user, logout } = this.props;

    return (
      <div className="container">
        <Helmet title="Login" />
        {!user && <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h2>Login methods</h2>
          {/* <FacebookLogin
              appId="635147529978862"
              fields="name,email,picture"
              onLogin={this.onFacebookLogin}
              component={this.FacebookLoginButton}
          /> */}
          <a href="/api/auth/twitch">
            <Button
              raised
              ripple
              style={{
                backgroundColor: '#4b367c',
                color: '#ffffff'
              }}
            >
              <span><i className="fa fa-twitch" style={{ width: '24px' }} /> Twitch</span>
            </Button>
          </a>
        </div>
        }
        {user && <div>
          <p>You are currently logged in as {user.email}.</p>

          <div>
            <button className="btn btn-danger" onClick={logout}><i className="fa fa-sign-out" />{' '}Log Out</button>
          </div>
        </div>
        }
      </div>
    );
  }
}
