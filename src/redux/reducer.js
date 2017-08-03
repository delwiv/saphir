import 'rxjs';
/* @flow weak */
import multireducer from 'multireducer';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import { combineEpics } from 'redux-observable';
import { reducer as form } from 'redux-form';
import auth from './modules/auth';
import teams, { searchStartEpic, searchEpic } from './modules/teams';
import notifs from './modules/notifs';
import counter from './modules/counter';
import info from './modules/info';
// import widgets from './modules/widgets';
// import survey from './modules/survey';
// import chat from './modules/chat';
// console.log(...teamsEpics)
const epics = combineEpics(searchEpic, searchStartEpic)


export const configureEpics = (deps: Object) => (action$, { getState }) =>
  combineEpics(...epics)(action$, { ...deps, getState })

// export const configureEpics = (deps: Object) => (action$, { getState }) =>
//   combineEpics(...rootEpic)(action$, { ...deps, getState });


export default function createReducers(asyncReducers) {
  return {
    routing: routerReducer,
    reduxAsyncConnect,
    online: (v = true) => v,
    notifs,
    auth,
    teams,
    ...asyncReducers
  };
}
