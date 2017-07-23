import users from './users';
import messages from './messages';
// import twitch from './twitch';

export default function services() {
  const app = this;

  app.configure(users);
  app.configure(messages);
  // app.configure(twitch);
}
