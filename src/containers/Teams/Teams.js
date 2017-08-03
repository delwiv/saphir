import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IndexLink } from 'react-router';
import { CardLink } from 'components';
// import { CounterButton, GithubButton } from 'components';
// import config from 'config';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
// import { asyncConnect } from 'redux-connect';
import { equals } from 'ramda'
// import { CardLink } from 'components';
import { Grid, Cell, Textfield, Button, FABButton } from 'react-mdl';
import { fetchUser, saveUser } from 'redux/modules/auth';

// @asyncConnect([{
//   promise: ({ store: { dispatch } }) => dispatch(fetchUser())
// }])

@connect(
  state => ({
    query: state.routing.locationBeforeTransitions.query,
    user: state.auth.user,
    token: state.auth.token,
    fetching: state.auth.fetchingTeams
  }), {
    fetchUser,
    saveUser,
  }
)
export default class Teams extends Component {

  static propTypes = {
    // user: PropTypes.object,
    // fetchUser: PropTypes.func.isRequired,
    // saveUser: PropTypes.func.isRequired,
    // fetching: PropTypes.bool
  };

  static defaultProps = {
    // user: {},
    // fetching: false
  }

  constructor(props) {
    super(props);
    this.state = { search: '' };
    // this.saveUser = this.saveUser.bind(this);
    // this.cancel = this.cancel.bind(this);
    // this.updateUser = this.updateUser.bind(this);
  }

  // componentDidMount() {
  //   if (equals({}, this.props.user))
  //     this.props.fetchUser();
  // }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.user &&
  //     (!equals(nextProps.user, this.props.user) ||
  //     !equals(nextProps.user, this.state.user)))
  //     this.setState({ user: nextProps.user });
  // }

  // saveUser() {
  //   this.props.saveUser(this.state.user);
  // }

  // cancel() {
  //   this.setState({ user: this.props.user });
  // }

  // updateUser(field) {
  //   return ({ target }) => {
  //     this.setState({
  //       user: {
  //         ...this.state.user,
  //         [field]: target.value
  //       }
  //     })
  //   }
  // }

  render() {
    const { search } = this.state;

    const styles = require('./Teams.scss');
    // require the logo image both from client and server
    return (
      <div className={styles.teams}>
        <Helmet title="Teams" />
        {/* <h1>T</h1> */}
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
                alignItems: 'stretch',
                // justifyContent: 'center'
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
                <Textfield
                  onChange={this.search}
                  floatingLabel
                  label="Search"
                  placeholder="Search a team or a game"
                  value={search}
                  style={{ flex: 4 }}
                />

                <FABButton
                  raised
                  ripple
                  accent
                  onClick={this.props.fetchUser}
                  // style={{ flex: 1 }}
                >
                  <i className="fa fa-search" />
                </FABButton>
              </div>
            </Cell>
          </Grid>
        </div>
      </div>
    );
  }
}
