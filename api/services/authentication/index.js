import auth from 'feathers-authentication';
import jwt from 'feathers-authentication-jwt';
import local from 'feathers-authentication-local';
// import oauth1 from 'feathers-authentication-oauth1';
import jwt2 from 'jsonwebtoken';
import oauth2 from 'feathers-authentication-oauth2';
import FacebookTokenStrategy from 'passport-facebook-token';
import { discard } from 'feathers-hooks-common';
import ppTwitch from 'passport-twitch';
import passport from 'passport';
import cors from 'cors';
import uuid from 'uuid/v1';
import User from '../users/user';

export socketAuth from './socketAuth';

function populateUser(authConfig) {
  return hook => hook.app.passport.verifyJWT(hook.result.accessToken, authConfig)
    .then(payload => hook.app.service('users').get(payload.userId))
    .then(user => {
      hook.result.user = user;
    });
}

function restToSocketAuth() {
  return hook => {
    console.log('sockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAythsockerAyth')
    if (hook.params.provider !== 'rest') return hook;
    const { accessToken, user } = hook.result;
    const { socketId } = hook.data;
    if (socketId && hook.app.io && accessToken) {
      const userSocket = Object.values(hook.app.io.sockets.connected).find(socket => socket.client.id === socketId);
      if (userSocket) {
        Object.assign(userSocket.feathers, {
          accessToken,
          user,
          authenticated: true
        });
      }
    }
    return hook;
  };
}


export default function authenticationService() {
  const app = this;

  const getUserFromTwitch = async (accessToken, refreshToken) => {
    const user = await app.get('twitchClient').getUser(accessToken);

    const existing = await User.findOne({ 'rawTwitch._id': user._id });

    if (!!existing) {
      console.log('updating auth data')
      if (!existing.auth)
        existing.auth = {};

      existing.auth.twitch = { accessToken, refreshToken };
      return existing.save();
    } else {
      console.log('create new user')
      return User.create({
        rawTwitch: user,  auth: {  twitch: { accessToken, refreshToken }  }
      });
    }
  }


  const config = app.get('config').auth;

  app.configure(auth(config))
    .configure(jwt())
    .configure(local())
    .configure(oauth2({
      name: 'facebook', // if the name differs from your config key you need to pass your config options explicitly
      Strategy: FacebookTokenStrategy
    }));


  app.get("/auth/twitch", (req, res, next) => {
    res.redirect(app.get('twitchClient').getAuthUrl({ state: uuid() }));
  });

  app.get("/auth/twitch/callback", async function(req, res) {
    try {
      const { access_token, refresh_token } = JSON.parse(await app.get('twitchClient').verify({
        ...req.query,
        grantType: 'authorization_code'
      }));

      const { TWITCH_PUBLIC_KEY } = app.get('config').env;
      const twitchPublicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6lq9MQ+q6hcxr7kOUp+tHlHtdcDsVLwVIw13iXUCvuDOeCi0VSuxCCUY6UmMjy53dX00ih2E4Y4UvlrmmurK0eG26b+HMNNAvCGsVXHU3RcRhVoHDaOwHwU72j7bpHn9XbP3Q3jebX6KIfNbei2MiR0Wyb8RZHE+aZhRYO8/+k9G2GycTpvc+2GBsP8VHLUKKfAs2B6sW3q3ymU6M0L+cFXkZ9fHkn9ejs+sqZPhMJxtBPBxoUIUQFTgv4VXTSv914f/YkNw+EjuwbgwXMvpyr06EyfImxHoxsZkFYB+qBYHtaMxTnFsZBr6fn8Ha2JqT1hoP7Z5r5wxDu3GQhKkHwIDAQAB`;

      const user = await getUserFromTwitch(access_token, refresh_token);
      const uid = uuid();
      await app.get('redis').setAsync(uid, user._id);

      res.redirect(`${app.get('config').env.SAPHIR_APP_HOST}/me?token=${uid}`);
    } catch(error) {
      console.log({ error });

      res.redirect(`${app.get('config').env.SAPHIR_APP_HOST}/?error=${error.message}`);
    }
  });

  app.service('authentication')
    .hooks({
      before: {
        // You can chain multiple strategies on create method
        create: auth.hooks.authenticate(['jwt', 'local', 'facebook']),
        remove: auth.hooks.authenticate('jwt')
      },
      after: {
        create: [
          populateUser(config),
          discard('user.password'),
          restToSocketAuth()
        ]
      }
    });
}
