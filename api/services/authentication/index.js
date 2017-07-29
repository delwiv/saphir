// @flow
import uuid from 'uuid/v4';
import { merge, pick } from 'ramda';

import User from '../users/user';
import { setDataForToken } from '../../lib/security';
import socketAuth from './socketAuth';

export { socketAuth };

const TWITCH_FIELDS = ['email', 'name', 'bio', 'logo'];

const extractTwitchFields = pick(TWITCH_FIELDS);


export default function authenticationService() {
  const app = this;

  const getUserFromTwitch = async (accessToken: string, refreshToken: string): User => {
    const userFromTwitch = await app.get('twitchClient').getUser(accessToken);

    const existing = await User.findOne({ twitch_id: userFromTwitch._id });

    if (existing) {
      console.log('updating existing user twitch data')
      Object.assign(existing, extractTwitchFields(userFromTwitch), { ...existing, twitchId: userFromTwitch._id });
      if (!existing.rawTwitch)
        existing.rawTwitch = {};

      existing.authTwitch = { accessToken, refreshToken };
      existing.rawTwitch = merge(existing.rawTwitch, userFromTwitch);
      return existing.save();
    }
    console.log('create new user')
    return User.create({
      ...extractTwitchFields(userFromTwitch),
      rawTwitch: userFromTwitch,
      authTwitch: { accessToken, refreshToken }
    });
  }


  app.get('/auth/twitch', (req, res) => {
    res.redirect(app.get('twitchClient').getAuthUrl({ state: uuid() }));
  });

  app.get('/auth/twitch/callback', async (req, res) => {
    try {
      const { access_token, refresh_token } = JSON.parse(await app.get('twitchClient').verify({
        ...req.query,
        grantType: 'authorization_code'
      }));

      const user = await getUserFromTwitch(access_token, refresh_token);

      const token = await setDataForToken(app.get('redis'), user.uid, 'userToken');

      res.cookie('authorization', token);

      res.redirect(`${app.get('config').env.SAPHIR_APP_HOST}/me`);
    } catch (error) {
      console.log({ error });

      res.redirect(`${app.get('config').env.SAPHIR_APP_HOST}/?error=${error.message}`);
    }
  });
}

// import auth from 'feathers-authentication';
// import jwt from 'feathers-authentication-jwt';
// import local from 'feathers-authentication-local';

// import oauth2 from 'feathers-authentication-oauth2';
// import FacebookTokenStrategy from 'passport-facebook-token';
// import { discard } from 'feathers-hooks-common';
// function populateUser(authConfig) {
//   return hook => hook.app.passport.verifyJWT(hook.result.accessToken, authConfig)
//     .then(payload => hook.app.service('users').get(payload.userId))
//     .then(user => {
//       hook.result.user = user;
//     });
// }

// function restToSocketAuth() {
//   return hook => {
//     if (hook.params.provider !== 'rest') return hook;
//     const { accessToken, user } = hook.result;
//     const { socketId } = hook.data;
//     if (socketId && hook.app.io && accessToken) {
//       const userSocket = Object.values(hook.app.io.sockets.connected).find(socket => socket.client.id === socketId);
//       if (userSocket) {
//         Object.assign(userSocket.feathers, {
//           accessToken,
//           user,
//           authenticated: true
//         });
//       }
//     }
//     return hook;
//   };
// }


// const config = app.get('config').auth;

// app.configure(auth(config))
//   .configure(jwt())
//   .configure(local())
//   .configure(oauth2({
//     name: 'facebook', // if the name differs from your config key you need to pass your config options explicitly
//     Strategy: FacebookTokenStrategy
//   }));

