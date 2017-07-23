import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router';
// import { CounterButton, GithubButton } from 'components';
// import config from 'config';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
// import { CardLink } from 'components';
// import { Grid, Cell } from 'react-mdl';
import { setTokenAndFetchUser } from 'redux/modules/auth';

@connect(
  state => ({
    online: state.online,
    query: state.routing.locationBeforeTransitions.query,
    token: state.auth.token
  }), {
    setTokenAndFetchUser
  }
)
export default class Me extends Component {

  static propTypes = {
    online: PropTypes.bool.isRequired,
    query: PropTypes.object.isRequired,
    token: PropTypes.string,
    setTokenAndFetchUser: PropTypes.func.isRequired
  };

  static defaultProps = {
    token: null
  }


  render() {
    const { online, query, token } = this.props;
    if (query.token && !token) {
      console.log('got token to save :', query.token)
      this.props.setTokenAndFetchUser(query.token);
    }

    const styles = require('./Me.scss');
    // require the logo image both from client and server
    const logoImage = require('./logo.png');
    return (
      <div className={styles.me}>
        <Helmet title="Me" />
        {query && Object.keys(query).map(k => (<p key={k}><strong>{k}</strong>{`  ${query[k]}`}</p>))}
        Online: {` ${online.toString()}`}
      </div>
    );
  }
}
