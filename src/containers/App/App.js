import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import Alert from 'react-bootstrap/lib/Alert';
import Helmet from 'react-helmet';
import { CSSTransitionGroup } from 'react-transition-group'
// import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { Notifs } from 'components';
import { push } from 'react-router-redux';
import config from 'config';
import { search } from 'redux/modules/teams';
import { asyncConnect } from 'redux-connect';
import {
  Layout,
  Header,
  Footer,
  FooterSection,
  FooterLinkList,
  FooterDropDownSection,
  Navigation,
  Textfield,
  IconButton,
  Drawer
} from 'react-mdl';

const SEARCH_TIMEOUT = 350

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];

    if (!isAuthLoaded(getState()))
      promises.push(dispatch(loadAuth()));

    // if (!isInfoLoaded(getState()))
    //   promises.push(dispatch(loadInfo()));

    return Promise.all(promises);
  }
}])


@connect(
  state => ({
    notifs: state.notifs,
    user: state.auth.user,
    searchResult: state.teams.searchResult
  }),
  { search, logout, pushState: push })
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    // router: PropTypes.object.isRequired,
    user: PropTypes.object,
    notifs: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    searchResult: PropTypes.array.isRequired,
  };

  static defaultProps = {
    user: null,
    searchResult: []
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { searchTerms: '', searchResult: [] };
    this.search = this.search.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
    if (this.state.searchTerms.trim().length)
      this.setState({ searchResult: nextProps.searchResult })
  }

  search({ target }) {
    const searchTerms = target.value
    this.setState({ searchTerms })

    if (this.searchTimeoutId)
      clearTimeout(this.searchTimeoutId)

    if (searchTerms.trim().length === 0) {
      this.setState({ searchResult: [] })
      return
    }

    this.searchTimeoutId = setTimeout(() => {
      this.props.search({ q: searchTerms })
      this.searchTimeoutId = null
    }, SEARCH_TIMEOUT)
  }

  clearSearch() {
    if (this.searchTimeoutId)
      clearTimeout(this.searchTimeoutId)
    this.setState({ searchResult: [], searchTerms: '' })
  }

  handleLogout = event => {
    event.preventDefault();
    this.props.logout();
    this.props.pushState('/');
  };

  render() {
    const { user, notifs, children } = this.props;
    const { searchTerms, searchResult } = this.state;
    const styles = require('./App.scss');

    const searchResultComponent = searchResult.map(u => (
      <div className={styles.searchResultRow} key={u.uid}>
        <img alt="avatar" src={u.avatar} style={{ flex: 1 }} />
        <div style={{ flex: 4, flexDirection: 'column' }}>
          <strong>{u.name}</strong>
          <p>{u.bio}</p>
        </div>
      </div>
    ))

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head} />
        <Layout fixedHeader>
          <Header style={{ paddingLeft: -70 }}>
            <span>
              <Textfield
                onChange={this.search}
                floatingLabel
                label="Search teams and users"
                placeholder="Search teams and users"
                value={searchTerms}
                style={{ maxWidth: '60%' }}
              />
            </span>
          </Header>
          <Drawer>
            <Navigation>
              <IndexLink to="/" activeStyle={{ color: '#33e0ff' }}>
                <span>Home</span>
              </IndexLink>
              {!user && <IndexLink to="/login">
                <span>Login</span>
              </IndexLink>}
              {user && <IndexLink to="/me">
                <span>My profile</span>
              </IndexLink>}
              {user && <span role="button" tabIndex={0} className="logout-link" onClick={this.handleLogout}>
                Logout
              </span>}
            </Navigation>
          </Drawer>
          <div className="searchResultContainer">
            <div className={styles.searchResult}>
              <CSSTransitionGroup
                transitionName="example"
                transitionAppear
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}
                style={{
                  // paddingTop: '12px'
                }}
              >
                <div
                  style={{
                    position: 'sticky',
                    // right: 0,
                    top: 0,
                    zIndex: 110
                  }}
                >
                  {searchResult.length ? <IconButton
                    onClick={this.clearSearch}
                    accent
                    name="clear_all"
                    style={{
                      position: 'absolute',
                      right: 10
                    }}
                  /> : ''}
                </div>
                {searchResultComponent}
              </CSSTransitionGroup>
            </div>
          </div>

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
          <Footer size="mega">
            <FooterSection type="middle">
              <FooterDropDownSection title="Features">
                <FooterLinkList>
                  <a href="/">About</a>
                  <a href="/">Terms</a>
                  <a href="/">Partners</a>
                  <a href="/">Updates</a>
                </FooterLinkList>
              </FooterDropDownSection>
              <FooterDropDownSection title="Details">
                <FooterLinkList>
                  <a href="/">Specs</a>
                  <a href="/">Tools</a>
                  <a href="/">Resources</a>
                </FooterLinkList>
              </FooterDropDownSection>
              <FooterDropDownSection title="Technology">
                <FooterLinkList>
                  <a href="/">How it works</a>
                  <a href="/">Patterns</a>
                  <a href="/">Usage</a>
                  <a href="/">Products</a>
                  <a href="/">Contracts</a>
                </FooterLinkList>
              </FooterDropDownSection>
              <FooterDropDownSection title="FAQ">
                <FooterLinkList>
                  <a href="/">Questions</a>
                  <a href="/">Answers</a>
                  <a href="/">Contact Us</a>
                </FooterLinkList>
              </FooterDropDownSection>
            </FooterSection>
            <FooterSection type="bottom" logo="Title">
              <FooterLinkList>
                <a href="/">Help</a>
                <a href="/">Privacy & Terms</a>
              </FooterLinkList>
            </FooterSection>
            <FooterSection>
              <span>© Mathemagics 2017</span>
            </FooterSection>
          </Footer>
          <div className="well text-right">
          </div>
        </Layout>
      </div>
    );
  }
}
