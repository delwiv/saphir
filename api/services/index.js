import users from './users';
import search from './search';
// import messages from './messages';
// import twitch from './twitch';

export default function services() {
  const app = this;

  app.use('/users', users);
  app.use('/search', search);
  // app.configure(messages);
  // app.configure(twitch);
}
