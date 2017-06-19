import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IndexLink } from 'react-router';
import { Button, Card, CardTitle, CardText, CardActions, CardMenu, IconButton } from 'react-mdl';

export default class CardLink extends Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    bg: PropTypes.string.isRequired,
  };

  render() {
    const { to, title, desc, bg } = this.props;
    const styles = require('./CardLink.scss');
    return (
      <Card shadow={0} className={styles.card}>
        <CardTitle
          style={{
            color: '#fff',
            height: '176px',
            background: `url(${bg}) center / cover`
          }}
        >
          {title}
        </CardTitle>
        <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Mauris sagittis pellentesque lacus eleifend lacinia...
            <p>{desc}</p>
        </CardText>
        <CardActions border>
          <Button colored>
            <IndexLink to={to}>
              <span>{title}</span>
            </IndexLink>
          </Button>
        </CardActions>
        <CardMenu style={{ color: '#fff' }}>
          <IconButton name="share" />
        </CardMenu>
      </Card>
    );
  }
}
