import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { IndexLink } from 'react-router';
// import { CardLink } from 'components';
// import { CounterButton, GithubButton } from 'components';
// import config from 'config';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
// import { asyncConnect } from 'redux-connect';
import { equals } from 'ramda'
// import { CardLink } from 'components';
// import { Grid, Cell } from 'react-mdl';
import { fetchUser, saveUser } from 'redux/modules/auth';
import { User } from 'components'

@connect(state => ({
  query: state.routing.locationBeforeTransitions.query,
  user: state.auth.user,
  token: state.auth.token,
  fetching: state.auth.fetchingMe
}), {
  fetchUser,
  saveUser,
})
export default class Me extends Component {

  static propTypes = {
    user: PropTypes.object,
    fetchUser: PropTypes.func.isRequired,
    saveUser: PropTypes.func.isRequired,
    // fetching: PropTypes.bool
  };

  static defaultProps = {
    user: {},
    fetching: false
  }

  constructor(props) {
    super(props);
    this.state = { user: props.user };
  }

  componentDidMount() {
    if (equals({}, this.props.user))
      this.props.fetchUser();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user &&
      (!equals(nextProps.user, this.props.user) ||
      !equals(nextProps.user, this.state.user)))
      this.setState({ user: nextProps.user });
  }

  render() {
    const { user } = this.state;

    const styles = require('./Me.scss');
    // require the logo image both from client and server
    return (
      <div className={styles.me}>
        <Helmet title="Me" />
        <span style={{ display: 'flex', justifyContent: 'center' }}><h3>{user.name}</h3></span>
        {/* query && Object.keys(query).map(k => (<p key={k}><strong>{k}</strong>{`  ${query[k]}`}</p>)) */}
        {/* user && Object.keys(user).map(k => (<p key={k}><strong>{k}</strong>{`  ${user[k]}`}</p>)) */}
        <User
          editMode
          user={user}
          fetchUser={this.props.fetchUser}
          saveUser={this.props.saveUser}
        />
      </div>
    );
  }
}
