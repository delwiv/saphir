import redis from 'redis';
import { promisifyAll } from 'bluebird';

promisifyAll(redis.RedisClient.prototype);


export default function () {
  const app = this;

  const { REDIS_HOST, REDIS_PORT } = app.get('config').env

  const client = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
  });

  app.set('redis', client);
}
