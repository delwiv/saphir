import cookie from 'js-cookie';
import superagent from 'superagent';
import config from '../config';

const methods = ['get', 'post', 'put', 'patch', 'del'];
function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  if (__SERVER__) {
    // Prepend host and port of the API server to the path.
    return `${config.apiHost}${adjustedPath}`;
  }
  // Prepend `/api` to relative URL, to proxy to API server.
  return `/api${adjustedPath}`;
}

export default class ApiClient {
  constructor(req) {
    methods.forEach(method => {
      this[method] = (path, { params, data, headers, files, fields } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));

        if (!this.token)
          this.setToken(cookie.get('authorization'));

        if (params)
          request.query(params);


        if (__SERVER__ && req.get('cookie'))
          request.set('cookie', req.get('cookie'));


        if (headers)
          request.set(headers);

        if (this.token)
          request.set('authorization', `Bearer ${this.token}`);

        if (this.twitchToken) {
          request.set('twitch-authorization', `Bearer ${this.twitchToken}`);
          this.twitchToken = null; // one time use
        }

        if (files)
          files.forEach(file => request.attach(file.key, file.value));


        if (fields)
          fields.forEach(item => request.field(item.key, item.value));


        if (data)
          request.send(data);

        console.log({ headers: request.header })

        request.end((err, { body } = {}) => (
          err ? reject(body || err) : resolve(body))
        );
      })
      .then(result => {
        const token = cookie.get('authorization')
        if (token && token !== this.token)
          this.setToken(token)
        return result;
      });
    });
  }

  setToken(token) {
    if (token !== undefined) {
      console.log({ setToken: token })
      this.token = token;
    }
  }

  setTwitchToken(token) {
    if (token !== undefined) {
      console.log({ setTwitchToken: token })
      this.twitchToken = token;
    }
  }
}
