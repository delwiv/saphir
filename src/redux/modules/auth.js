import { socket } from 'app';
import { SubmissionError } from 'redux-form';
import cookie from 'js-cookie';

const LOAD = 'redux-example/auth/LOAD';
const LOAD_SUCCESS = 'redux-example/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/auth/LOAD_FAIL';
const LOGIN = 'redux-example/auth/LOGIN';
const LOGIN_SUCCESS = 'redux-example/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'redux-example/auth/LOGIN_FAIL';
const REGISTER = 'redux-example/auth/REGISTER';
const REGISTER_SUCCESS = 'redux-example/auth/REGISTER_SUCCESS';
const REGISTER_FAIL = 'redux-example/auth/REGISTER_FAIL';
const LOGOUT = 'redux-example/auth/LOGOUT';
const LOGOUT_SUCCESS = 'redux-example/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'redux-example/auth/LOGOUT_FAIL';
const FETCH_ME = 'redux-example/auth/FETCH_ME';
const FETCH_ME_SUCCESS = 'redux-example/auth/FETCH_ME_SUCCESS';
const FETCH_ME_FAIL = 'redux-example/auth/FETCH_ME_FAIL';
const SAVE_USER = 'redux-example/auth/SAVE_USER';
const SAVE_USER_SUCCESS = 'redux-example/auth/SAVE_USER_SUCCESS';
const SAVE_USER_FAIL = 'redux-example/auth/SAVE_USER_FAIL';

const initialState = {
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        accessToken: action.result.accessToken,
        user: action.result.user
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        accessToken: action.result.accessToken,
        user: action.result.user
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        loginError: action.error
      };
    case REGISTER:
      return {
        ...state,
        registeringIn: true
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        registeringIn: false
      };
    case REGISTER_FAIL:
      return {
        ...state,
        registeringIn: false,
        registerError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        accessToken: null,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    case FETCH_ME:
      return {
        ...state,
        fetchingMe: true
      };
    case FETCH_ME_SUCCESS:
      return {
        ...state,
        user: action.result.user,
        fetchingMe: false
      };
    case FETCH_ME_FAIL:
      return {
        ...state,
        fetchingMe: false
      };
    case SAVE_USER:
      return {
        ...state,
        saving: true
      };
    case SAVE_USER_SUCCESS:
      return {
        ...state,
        user: action.result.user,
        saving: false
      };
    case SAVE_USER_FAIL:
      return {
        ...state,
        saving: false
      };
    default:
      return state;
  }
}

const catchValidation = error => {
  if (error.message) {
    if (error.message === 'Validation failed' && error.data)
      throw new SubmissionError(error.data);

    throw new SubmissionError({ _error: error.message });
  }
  return Promise.reject(error);
};

function setToken({ app, restApp, client }) {
  return response => {
    const { token } = response;

    app.set('accessToken', token);
    restApp.set('accessToken', token);
    client.setToken(token);

    return response;
  };
}

function setCookie({ app }) {
  return response => app.passport.verifyJWT(response.accessToken)
    .then(payload => {
      const options = payload.exp ? { expires: new Date(payload.exp * 1000) } : undefined;
      cookie.set('feathers-jwt', app.get('accessToken'), options);
      return response;
    });
}

function setUser({ app, restApp }) {
  return response => {
    app.set('user', response.user);
    restApp.set('user', response.user);
    return response;
  };
}

/*
* Actions
* * * * */
export function fetchUser() {
  const twitchToken = cookie.get('twitch-authorization');

  return {
    types: [FETCH_ME, FETCH_ME_SUCCESS, FETCH_ME_FAIL],
    promise: async ({ client, app, restApp }) => {
      if (twitchToken)
        client.setTwitchToken(twitchToken)
      return client.get('/users/me')
      .then(setToken({ app, restApp, client }))
    }
  }
}

export function saveUser(user) {
  return {
    types: [SAVE_USER, SAVE_USER_SUCCESS, SAVE_USER_FAIL],
    promise: ({ client }) => client.patch('/users/me', { data: user })
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: ({ app, restApp, client }) => Promise.resolve({
      token: cookie.get('authorization')
    })
    .then(setToken({ client, app, restApp }))
  };
}

export function register(data) {
  return {
    types: [REGISTER, REGISTER_SUCCESS, REGISTER_FAIL],
    promise: ({ app }) => app.service('users').create(data).catch(catchValidation)
  };
}

export function login(strategy, data, validation = true) {
  const socketId = socket.io.engine.id;
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: ({ client, restApp, app }) => restApp.authenticate({
      ...data,
      strategy,
      socketId
    })
      .then(setToken({ client, app, restApp }))
      .then(setCookie({ app }))
      .then(setUser({ app, restApp }))
      .catch(validation ? catchValidation : error => Promise.reject(error))
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: ({ client, app, restApp }) => Promise
    .resolve(setToken({ client, app, restApp })({ token: null }))
    .then(() => {
      cookie.remove('authorization');
      return Promise.resolve();
    })
  }
}
