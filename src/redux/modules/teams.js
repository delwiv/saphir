const SEARCH = 'saphir/teams/SEARCH';
const SEARCH_SUCCESS = 'saphir/teams/SEARCH_SUCCESS';
const SEARCH_FAIL = 'saphir/teams/SEARCH_FAIL';

const initialState = {
  searchResult: []
};

export default function reducer(state: Object = initialState, action: Object = {}) {
  switch (action.type) {
    case SEARCH_SUCCESS:
      return { ...state, searchResult: action.result.result };
    default:
      return state;
  }
}

export function search(terms) {
  return {
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FAIL],
    promise: ({ client }) => client.get('/search', { params: terms })
  }
}
