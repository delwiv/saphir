import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import Alert from 'react-bootstrap/lib/Alert';
import Helmet from 'react-helmet';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { Notifs } from 'components';
import { push } from 'react-router-redux';
import config from 'config';
import { asyncConnect } from 'redux-connect';
import { Layout, Header, Textfield, Navigation, Drawer } from 'react-mdl';
@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];

    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }
    if (!isInfoLoaded(getState())) {
      promises.push(dispatch(loadInfo()));
    }
    return Promise.all(promises);
  }
}])
@connect(
  state => ({
    notifs: state.notifs,
    user: state.auth.user
  }),
  { logout, pushState: push })
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    user: PropTypes.object,
    notifs: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static defaultProps = {
    user: null
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      const redirect = this.props.router.location.query && this.props.router.location.query.redirect;
      this.props.pushState(redirect || '/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
  }

  handleLogout = event => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const { user, notifs, children } = this.props;
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head} />
        <Layout fixedHeader fixedDrawer>
          <Header title="Title">
            <Textfield
              value=""
              onChange={() => {}}
              label="Search"
              expandable
              expandableIcon="search"
            />
          </Header>
          <Drawer title="Title">
            <Navigation>
              <IndexLink to="/" activeStyle={{ color: '#33e0ff' }}>
                <div className={styles.brand} />
                <span>{config.app.title}</span>
              </IndexLink>
              {!user && <IndexLink to="/login">
                <span>Login</span>
              </IndexLink>}
              {!user && <IndexLink to="/register">
                <span>Register</span>
              </IndexLink>}
              {user && <IndexLink to="/logout">
                <span role="button" tabIndex={0} className="logout-link" onClick={this.handleLogout}>
                  Logout
                </span>
              </IndexLink>}
            </Navigation>
          </Drawer>
          <div className={styles.appContent}>
            {notifs.global && <div className="container">
              <Notifs
                className={styles.notifs}
                namespace="global"
                NotifComponent={props => <Alert bsStyle={props.kind}>{props.message}</Alert>}
            />
            </div>}

            {children}
          </div>
          <div className="well text-right">
            © Mathemagics 2017
          </div>
        </Layout>
      </div>
    );
  }
}
