// action - state management
import * as actionTypes from './actions';

const initialState = {
  resources: {},
  prev: null,
  curr: null
};

//-----------------------|| FILTER REDUCER ||-----------------------//

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FILTER_UPDATE:
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.resource]: action.payload
        }
      };
    case actionTypes.FILTER_STATE:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export default filterReducer;
