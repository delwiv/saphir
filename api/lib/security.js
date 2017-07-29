// @flow
import { RedisClient } from 'redis';
import uuid from 'uuid/v4';
import { path } from 'ramda';
import type { NextFunction, $Response, $Request, $Application } from 'express'
const unsecuredRoutes = [
  '/auth/twitch',
  '/auth/twitch/callback'
]

export const setDataForToken = async (redis: RedisClient, value: string, prefix?: string) => {
  const token = uuid();
  const key = `saphir::${prefix ? `${prefix}/` : ''}${token}`;
  console.log('setDataForToken', { key, value })
  await redis.setAsync(key, value);
  return token;
}

export const setData = (redis: RedisClient, key: string, value: string, prefix?: string): Promise<string> => {
  const setKey = `saphir::${prefix ? `${prefix}/` : ''}${key}`;
  console.log('setData', { setKey, value })
  return redis.setAsync(key, value);
}

export const getData = (redis: RedisClient, key: string, prefix?: string): Promise<string> => {
  const readKey = `saphir::${prefix ? `${prefix}/` : ''}${key}`;
  return redis.getAsync(readKey)
  .then(value => {
    console.log('getData', { readKey, value });
    return value;
  });
}

export const deleteData = (redis: RedisClient, key: string, prefix?: string): Promise<any> => {
  const deleteKey = `saphir::${prefix ? `${prefix}/` : ''}${key}`;
  console.log('deleteData', { deleteKey });
  return redis.delAsync(deleteKey);
}

export default function (app: $Application) {
  return async (req: $Request, res: $Response, next: NextFunction) => {
    if (unsecuredRoutes.includes(req.path))
      return next();
    const auth = path(['headers', 'authorization'], req);
    if (!auth)
      return res.status(401).json({ error: new Error('no authorization in headers') });

    const token = auth.split('Bearer ')[1];

    if (!token)
      return res.status(401).send('token is not valid');


    const comesFromTwitch = req.path === '/users/me';

    console.log({ comesFromTwitch });

    const redis = app.get('redis');

    let uid = null;

    uid = await getData(redis, token, 'userToken');

    if (!uid)
      return res.status(401).send('uid not found');

    res.cookie('authorization', comesFromTwitch ? await setDataForToken(redis, uid, 'userToken') : token);

    res.locals.uid = uid;

    next();
  }
}
