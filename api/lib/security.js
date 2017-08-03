// @flow
import type { RedisClient } from 'redis'
import { path } from 'ramda';
import type { NextFunction, $Response, $Request, $Application } from 'express'
const unsecuredRoutes = [
  '/auth/twitch',
  '/auth/twitch/callback',
  '/users/all',
  '/users/create'
]

export default function (app: $Application) {
  return async (req: $Request, res: $Response, next: NextFunction) => {
    if (unsecuredRoutes.includes(req.path))
      return next();

    const redis: RedisClient = app.get('redis');
    const authTwitch = path(['headers', 'twitch-authorization'], req);

    if (authTwitch) {
      const twitchToken = authTwitch.split('Bearer ')[1];
      const uid = await redis.getData({
        key: twitchToken,
        prefix: 'twitchToken'
      });

      if (!uid)
        return res.status(401).send('uid not found');

      await redis.deleteData({
        key: twitchToken,
        prefix: 'twitchToken'
      });

      res.cookie('authorization', await redis.setDataForToken({
        value: uid,
        prefix: 'userToken'
      }));
      res.clearCookie('twitch-authorization');

      res.locals.uid = uid;
      return next();
    }

    const auth = path(['headers', 'authorization'], req);

    if (!auth)
      return res.status(401).json({ error: new Error('no `authorization` in headers') });

    const token = auth.split('Bearer ')[1];

    if (!token)
      return res.status(401).send('token is not valid');

    const uid = await redis.getData({
      key: token,
      prefix: 'userToken'
    });

    if (!uid)
      return res.status(401).send('uid not found');

    await redis.expireKey({
      key: token,
      prefix: 'userToken'
    })

    res.cookie('authorization', token);

    res.locals.uid = uid;

    next();
  }
}
