import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router';
// import { CounterButton, GithubButton } from 'components';
import config from 'config';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { CardLink } from 'components';
import { Grid, Cell } from 'react-mdl';

@connect(
  state => ({
    online: state.online
  })
)
export default class Home extends Component {

  static propTypes = {
    online: PropTypes.bool.isRequired
  };

  render() {
    const { online } = this.props;
    const styles = require('./Home.scss');
    // require the logo image both from client and server
    const logoImage = require('./logo.png');
    return (
      <div className={styles.home}>
        <Helmet title="Home" />
        <div className={styles.masthead}>
          <div className="container">
            <div className={styles.logo}>
              <p>
                <img src={logoImage} alt="presentation" />
              </p>
            </div>
            <h1>{config.app.title}</h1>
            <h2>{config.app.description}</h2>

          </div>
        </div>

        <Grid style={{ width: '97%' }}>
          <Cell col={6} tablet={4}>
            <CardLink
              to="/tournaments"
              title="Tournaments"
              desc="Tournaments"
              bg="http://euw.leagueoflegends.com/sites/default/files/styles/scale_xlarge/public/upload/wc_numbers_banner_17.jpg?itok=pZSmd4xY"
            />
          </Cell>
          <Cell col={6} tablet={4}>
            <CardLink
              to="/teams"
              title="Teams"
              desc="Teams"
              bg="http://static.mnium.org/images/contenu/actus/LOL/LCS2014/Recap/1150494_702525003100878_650756820_o.jpg"
            />
          </Cell>
          <Cell col={6} tablet={4}>
            <CardLink
              to="/profile"
              title="Profile"
              desc="Profile"
              bg="http://quanticfoundry.com/wp-content/uploads/2015/07/photodune-9235903-game-m-16x9.jpg"
            />
          </Cell>
          <Cell col={6} tablet={4}>
            <CardLink
              to="/meet"
              title="Meet"
              desc="Meet Meet Meet Meet Meet Meet Meet Meet Meet Meet Meet Meet Meet Meet"
              bg="https://2.bp.blogspot.com/-_LijqBWZexo/WMWSdklat4I/AAAAAAAAotE/8aivsdwaQxwLZGdtTInw_BacfmUdLxTKgCLcB/s1600/Transparent%2BLogo%2BFile.png"
            />
          </Cell>
        </Grid>
        Online: {` ${online.toString()}`}
      </div>
    );
  }
}
