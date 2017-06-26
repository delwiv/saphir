/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router';
// import { CounterButton, GithubButton } from 'components';
import Helmet from 'react-helmet';
import { merge } from 'ramda'
import { connect } from 'react-redux';
import { CardLink } from 'components';
import {
  Button,
  Grid,
  Cell,
  Card,
  CardTitle,
  CardText,
  CardActions,
  CardMenu,
  IconButton,
  Icon,
  Tooltip
} from 'react-mdl';

const placeholderUser = {
  banner: 'http://static.mnium.org/images/contenu/actus/LOL/LCS2014/Recap/1150494_702525003100878_650756820_o.jpg',
  games: [{
    name: 'League of Legends',
    img: 'http://dotageeks.com/wp-content/uploads/2015/10/League-Of-Legends-Logo-4.jpg',
    roles: ['Support', 'Jungler'],
    characters: ['Jaina', 'Blitzcrank', 'Fiddlestick']
  }, {
    name: 'CS:GO',
    img: 'https://logodownload.org/wp-content/uploads/2014/09/CS-GO-logo.png',
    roles: ['Counter'],
    characters: ['Sniper']
  }, {
    name: 'StarCraft II',
    img: 'http://www.blogamer.fr/blog/wp-content/uploads/2010/07/starcraft2.jpg',
    roles: [],
    characters: ['Zergs', 'Terrans']
  }],
  name: 'John Delwiv',
  alias: 'The Programmator',
  team: 'Mathemagics',
  desc: 'Hi, my name is John << The Programmator >> Delwiv. Hi, my name is John << The Programmator >> Delwiv. Hi, my name is John << The Programmator >> Delwiv. Hi, my name is John << The Programmator >> Delwiv. Hi, my name is John << The Programmator >> Delwiv. Hi, my name is John << The Programmator >> Delwiv. Hi, my name is John << The Programmator >> Delwiv. ', // eslint-disable-line
  victories: {
    '30d': 6,
    '6m': 23,
    '1y': 52
  },
  followers: 214,
  achievements: 16
}
@connect(state => ({ user: merge(state.auth.user, placeholderUser) }))
export default class Profile extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired
  };

  render() {
    const { user } = this.props;
    const styles = require('./Profile.scss');

    const heads = []
    // require the logo image both from client and server
    return (
      <div className={styles.profile}>
        <Helmet title="Profile" />
        <Card shadow={2} className={styles.header}>
          <CardTitle
            style={{
              color: '#fff',
              position: 'relative',
              height: '200px',
              background: `url(${user.banner}) center / cover`,
              margin: 0,
              padding: 0
            }}
          >
            <span style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              backgroundColor: 'rgba(255, 255, 255, .5)',
              color: '#000',
              fontSize: 48

            }}>
              {user.name}
            </span>
          </CardTitle>
          <CardText className="row">
          <div className="col-xs-4 text-center">
            <Tooltip
              position="top"
              label={(
                <table width="100%">
                  <tbody width="100%">
                    <tr width="100%"><th>Last 30 days</th><td className="text-right">{user.victories['30d']}</td></tr>
                    <tr width="100%"><th>Last 6 months</th><td className="text-right">{user.victories['6m']}</td></tr>
                    <tr width="100%"><th>Last year</th><td className="text-right">{user.victories['1y']}</td></tr>
                  </tbody>
                </table>
                )}>
              <div style={{
                display:'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <span><i className="fa fa-trophy" /> Victories</span>
                <span>{user.victories['30d']}</span>
              </div>
            </Tooltip>
          </div>
          <div className="col-xs-4 text-center" style={{ display:'flex' , alignItems: 'center' }}>
            <div className="row">
              <div className="col-xs-12"><i className="fa fa-users" /> Followers</div>
              <div className="col-xs-12">{user.followers}</div>
            </div>
          </div>
          <div className="col-xs-4 text-center" style={{ display:'flex' , alignItems: 'center' }}>
            <div className="row">
              <div className="col-xs-12"><i className="fa fa-star" /> Achievements</div>
              <div className="col-xs-12">{user.achievements}</div>
            </div>
          </div>
          </CardText>
          <CardMenu style={{ color: '#fff' }}>
            <IconButton name="share" />
          </CardMenu>
        </Card>
        <Card shadow={2} className={styles.header}>
          <CardTitle style={{
              backgroundColor: '#a2a2a2',
          }}>
            <span style={{
              color: '#000',
              fontSize: 48
            }}>
              Games
            </span>
          </CardTitle>
          <CardText>
            Games played by {user.name}
            <Grid style={{
              alingItems: 'stretch'
            }}>
            {user.games.concat([...user.games].reverse()).map(game => (
              <Cell col={4} >
                <Card shadow={2} style={{
                width: '100%',
                height: '100%'
              }} >
                  <CardTitle style={{
                    height: '175px',
                    background: `url(${game.img}) center / cover no-repeat`,
                  }}>
                  </CardTitle>
                  <CardText>
                    {game.name}
                    {game.roles.length && <span>
                      <h4>Roles</h4>
                      <ul>
                        {game.roles.map((r, key) => <li key={key}>{r}</li>)}
                      </ul>
                    </span>}
                    {game.characters.length && <span>
                      <h4>Characters</h4>
                      <ul>
                        {game.characters.map((c, key) => <li key={key}>{c}</li>)}
                      </ul>
                    </span>}
                  </CardText>

                  <CardMenu style={{ color: '#fff' }}>
                    <IconButton name="share" />
                  </CardMenu>
                </Card>
              </Cell>
            ))}

            </Grid>
          </CardText>

          <CardMenu style={{ color: '#fff' }}>
            <IconButton name="share" />
          </CardMenu>
        </Card>

      </div>
    );
  }
}
