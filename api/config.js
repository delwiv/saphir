import getEnv from './env'

const ONE_DAY = 60 * 60 * 24 * 1000;

const env = [
  'MONGO_PORT',
  'MONGO_HOST',
  'MONGO_DB',
  'REDIS_PORT',
  'REDIS_HOST',
  'REDIS_PW',
  'REDIS_SECRET',
  'SAPHIR_API_HOST',
  'SAPHIR_API_PORT',
  'SAPHIR_APP_HOST',
  'SAPHIR_APP_PORT',
  'SAPHIR_SECRET',
  'TWITCH_CLIENT_ID',
  'TWITCH_CLIENT_SECRET',
  'TWITCH_PUBLIC_KEY'
  // 'MONGO_USER',
  // 'MONGO_PASS',
  // 'API_PORT',
  // 'SESSION_SECRET',
  // 'FB_CLIENT_ID',
  // 'FB_CLIENT_SECRET',
  // 'TWITCH_CLIENT_ID'
]

export default () => {
  const config = env.reduce((acc, e) => {
    acc[e] = getEnv(e)
    return acc
  }, {})

  return {
    env: config,
    auth: {
      secret: 'super secret',
      cookie: {
        enabled: true,
        httpOnly: false,
        maxAge: ONE_DAY,
        secure: process.env.NODE_ENV === 'production'
      },
      facebook: {
        path: '/auth/facebook',
        clientID: '635147529978862',
        clientSecret: '28c16a4effa4a5f1371924e4dd12c8cd',
        permissions: {
          authType: 'rerequest'
        },
        scope: ['public_profile', 'email'],
        profileFields: ['id', 'displayName', 'photos', 'email', 'first_name', 'last_name', 'age_range'],
        accessTokenField: 'accessToken'
      },
      twitch: {
        path: '/auth/twitch',
        clientID: config.TWITCH_CLIENT_ID,
        clientSecret: config.TWITCH_CLIENT_SECRET,
        callbackURL: `${config.SAPHIR_APP_HOST}/api/auth/twitch/callback`,
        scope: 'user_read'
      }
    }
  }
}
