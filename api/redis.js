// @flow
import redis from 'redis'
import { promisifyAll } from 'bluebird'
import uuid from 'uuid/v4'

const FIFTEEN_MINUTES = 60 * 15

promisifyAll(redis.RedisClient.prototype)

Object.assign(redis.RedisClient.prototype, {
  async setDataForToken({ value, prefix, expire = FIFTEEN_MINUTES }: {
    value: string,
    prefix?: string,
    expire?: number
  }): Promise<string> {
    const token = uuid()
    const key = `saphir::${prefix ? `${prefix}/` : ''}${token}`
    console.log('setDataForToken', { key, value })
    const expireParams = expire ? ['EX', expire] : []
    const params = [key, value, ...expireParams]
    await this.setAsync(...params)
    return token
  },
  setData({ key, value, prefix }: {
    key: string,
    value: string, prefix?:
    string
  }): Promise<string> {
    const setKey = `saphir::${prefix ? `${prefix}/` : ''}${key}`
    console.log('setData', { setKey, value })
    return this.setAsync(key, value)
  },

  getData({ key, prefix }: {
    key: string,
    prefix?: string
  }): Promise<string> {
    const readKey = `saphir::${prefix ? `${prefix}/` : ''}${key}`
    return this.getAsync(readKey)
    .then(value => {
      console.log('getData', { readKey, value })
      return value
    })
  },
  deleteData({ key, prefix }: {
    key: string,
    prefix?: string
  }): Promise<any> {
    const deleteKey = `saphir::${prefix ? `${prefix}/` : ''}${key}`
    console.log('deleteData', { deleteKey })
    return this.delAsync(deleteKey)
  },
  expireKey({ key, prefix, expire = FIFTEEN_MINUTES }: {
    key: string,
    prefix?: string,
    expire: number
  }): Promise<number> {
    const expireKey = `saphir::${prefix ? `${prefix}/` : ''}${key}`
    console.log('expireData', { expireKey, expire })
    return this.expireAsync(expireKey, expire)
  }
})

export default function () {
  const app = this

  const { REDIS_HOST, REDIS_PORT } = app.get('config').env

  const client: redis.RedisClient = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
  })

  app.set('redis', client)
}
