import TwitchClient from 'node-twitchtv';

export default function() {
  const {
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
    OAUTH_REDIRECT_PATH,
    SAPHIR_APP_HOST
  } = this.get('config').env;

  const client = new TwitchClient({
    clientId: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_CLIENT_SECRET,
    redirectUri: `${SAPHIR_APP_HOST}/api/auth/twitch/callback`,
    scope: ['user_read']
  });

  this.set('twitchClient', client);
}
