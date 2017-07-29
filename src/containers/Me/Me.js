import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router';
// import { CounterButton, GithubButton } from 'components';
// import config from 'config';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
// import { asyncConnect } from 'redux-connect';
import { equals } from 'ramda'
// import { CardLink } from 'components';
import { Grid, Cell, Textfield, Button } from 'react-mdl';
import { fetchUser, saveUser } from 'redux/modules/auth';

// @asyncConnect([{
//   promise: ({ store: { dispatch } }) => dispatch(fetchUser())
// }])

@connect(
  state => ({
    query: state.routing.locationBeforeTransitions.query,
    user: state.auth.user,
    token: state.auth.token,
    fetching: state.auth.fetchingMe
  }), {
    fetchUser,
    saveUser,
  }
)
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
    if (nextProps.user && !equals(nextProps.user, this.props.user))
      this.setState({ user: nextProps.user });
  }

  saveUser() {
    this.props.saveUser(this.state.user);
  }

  cancel() {
    this.setState({ user: this.props.user });
  }

  render() {
    const { user } = this.state;

    const styles = require('./Me.scss');
    // require the logo image both from client and server
    return (
      <div className={styles.me}>
        <Helmet title="Me" />
        <h1>My profile</h1>
        <Button
          raised
          ripple
          colored
          onClick={this.props.fetchUser}
        >Reload</Button>
        {/* query && Object.keys(query).map(k => (<p key={k}><strong>{k}</strong>{`  ${query[k]}`}</p>)) */}
        {/* user && Object.keys(user).map(k => (<p key={k}><strong>{k}</strong>{`  ${user[k]}`}</p>)) */}
        <div>
          <Grid>
            <Cell
              col={6}
              phone={12}
              offsetDesktop={3}
              offsetTablet={0}
              style={{
                display: 'flex',
                flexDirection: 'column',
                // alignItems: 'center',
                // justifyContent: 'center'
              }}
            >
              <Textfield
                floatingLabel
                label="Name"
                value={user.name}
                style={{ width: '100%' }}
              />
              <Textfield
                floatingLabel
                label="E-mail"
                value={user.email}
                style={{ width: '100%' }}
              />
            </Cell>
            <Cell
              col={6}
              phone={12}
              offsetDesktop={3}
              offsetTablet={0}
              style={{
                display: 'flex',
                flexDirection: 'column',
                // alignItems: 'center',
                // justifyContent: 'center'
              }}
            >
              <Textfield
                label="Bio"
                floatingLabel
                placeholder="Write something about yourself, and your gaming experience"
                rows={5}
                style={{ width: '100%' }}
                value={user.bio || ''}
              />
            </Cell>
          </Grid>
          <div
            style={{
              display: 'flex',
              alignSelf: 'stretch',
              justifyContent: 'center'
            }}
          >

            <Button
              raised
              ripple
              accent
              onClick={this.cancel}
            >Cancel</Button>
            <Button
              raised
              ripple
              colored
              onClick={this.saveUser}
            >Save profile</Button>
          </div>
        </div>}

      </div>
    );
  }
}
