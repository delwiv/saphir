import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { equals, isEmpty, merge, assocPath } from 'ramda'
import {
  Grid,
  Cell,
  Textfield,
  Button,
  Icon,
  FABButton
} from 'react-mdl';

import { SliderModel } from '.'

export default class User extends Component {

  static propTypes = {
    user: PropTypes.object,
    fetchUser: PropTypes.func.isRequired,
    saveUser: PropTypes.func.isRequired,
    editMode: PropTypes.bool
  };

  static defaultProps = {
    user: {},
    editMode: false
  }

  constructor(props) {
    super(props);
    this.state = { user: props.user };
    this.saveUser = this.saveUser.bind(this);
    this.cancel = this.cancel.bind(this);
    this.updateUser = this.updateUser.bind(this);
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

  saveUser() {
    this.props.saveUser(this.state.user);
  }

  cancel() {
    this.setState({ user: this.props.user });
  }

  updateUser(path) {
    return ({ target }) => {
      const stateUser = this.state.user
      const { value } = target;
      const user = assocPath(path, value, stateUser)
      console.log({ path, user, stateUser })
      this.setState({ user })
    }
  }

  render() {
    const { user } = this.state;
    const { editMode } = this.props;

    console.log(user)
    if (isEmpty(user))
      return (<div>Fetching user...</div>)

    const styles = require('./User.scss');

    // require the logo image both from client and server
    return (
      <div className={styles.user}>
        <Grid>
          <Cell
            col={8}
            tablet={8}
            phone={6}
            offsetDesktop={2}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'relative'
              }}
            >
              <img
                alt="Avatar"
                width={200}
                style={{
                  borderRadius: 100
                }}
                src={user.avatar || require('./default-avatar.png')}
              />
              {editMode && <FABButton
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0
                }}
                accent
                ripple
                onClick={console.log}
              >
                <Icon name="file_upload" />
              </FABButton>}
            </div>
          </Cell>
          {editMode && <Cell
            col={8}
            tablet={8}
            phone={6}
            offsetDesktop={2}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Textfield
              onChange={this.updateUser(['name'])}
              floatingLabel
              label="Name"
              value={user.name}
              style={{ width: '100%' }}
            />
            <Textfield
              onChange={this.updateUser(['email'])}
              floatingLabel
              label="E-mail"
              value={user.email}
              style={{ width: '100%' }}
            />
          </Cell>}
          <Cell
            col={8}
            tablet={8}
            phone={6}
            offsetDesktop={2}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <strong>TEAMS</strong>
            <div className={styles.vertical}>
              {user.teams && user.teams.filter(o => !!o).map((team, i) => (<SliderModel
                updateUser={this.updateUser(['teams', i])}
                key={team}
                editMode={editMode}
                model={{
                  name: team,
                  desc: 'League of Legends Team Leader'
                }}
              />))}
            </div>
            <div style={{ position: 'relative', width: '100%' }}>
              {editMode && <FABButton
                style={{
                  position: 'absolute',
                  bottom: -15,
                  right: 10
                }}
                accent
                ripple
                onClick={console.log}
              >
                <Icon name="add" />
              </FABButton>}
            </div>
            <Textfield
              onChange={this.updateUser(['bio'])}
              label="Bio"
              floatingLabel
              disabled={!editMode}
              placeholder="Write something about yourself, and your gaming experience"
              rows={5}
              value={user.bio || ''}
            />
            <strong>GAMES</strong>
            <div className={styles.vertical}>
              {user.games && user.games.filter(o => !!o).map((game, i) => (<SliderModel
                updateUser={this.updateUser(['games', i])}
                key={`${game.name}${i}`}
                editMode={editMode}
                model={{
                  ...game,
                  desc: `${game.genre} - ${game.role}`
                }}
              />))}
            </div>

            <Textfield
              onChange={this.updateUser(['address', 'city'])}
              label="City"
              floatingLabel
              disabled={!editMode}
              placeholder="Your city"
              value={user.address.city || ''}
            />
            <Textfield
              onChange={this.updateUser(['address', 'country'])}
              label="Country"
              floatingLabel
              disabled={!editMode}
              placeholder="Your country"
              value={user.address.country || ''}
            />

            <strong>GENRES</strong>
            <div className={styles.vertical}>
              {user.genres && user.genres.filter(o => !!o).map((genre, i) => (<SliderModel
                updateUser={this.updateUser(['genres', i])}
                key={`${genre.name}${i}`}
                editMode={editMode}
                model={{
                  name: genre,
                  desc: `${genre} - Moho !`
                }}
              />))}
            </div>

            <Textfield
              label="Member since"
              floatingLabel
              disabled
              value={`${moment(user.createdAt).format('DD/MM/YY')} (${moment(user.createdAt).fromNow()})`}
            />
          </Cell>
        </Grid>
        {editMode && <div
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
        </div>}
      </div>
    );
  }
}

/*
<div>
  <span>Team: </span>
  {user.teams && user.teams.length ? user.teams.map(team => (<CardLink
    to={`/team/${team.uid}`}
    title={team.name}
    desc={team.desc}
    bg={team.banner}
    />)) : <IndexLink to="/teams/search">
      <Button
        accent
        ripple
        raised
      >Create</Button>
    </IndexLink>
  }
</div>
 */
