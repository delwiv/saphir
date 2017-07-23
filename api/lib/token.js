
import uuid from 'uuid/v1';
import { path } from 'ramda';

const unsecuredRoutes = [
  '/auth/twitch',
  '/auth/twitch/callback',
  '/loadInfo'
]

export const setToken = async (redis, userId) => {
  const token = uuid();
  await redis.setAsync(`saphir::user/${token}`, userId);
  return token;
}

export const getUserId = (redis, token) => redis.getAsync(`saphir::user/${token}`);

export default function (app) {
  return async (req, res, next) => {
    if (unsecuredRoutes.includes(req.path))
      return next();
    const auth = path(['headers', 'authorization'], req);
    if (!auth)
      return res.status(401).json({ error: new Error('no authorization in headers') });

    const token = auth.split('Bearer ')[1];

    const userId = await getUserId(app.get('redis'), token);

    req.userId = userId;

    next();
  }
}
