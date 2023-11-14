import { combineReducers } from 'redux';
import datesReducer from './datesreducer';
import statusReducer from './statusreducer';
import resultsReducer from './resultsreducer';

const rootReducer = combineReducers({
  dates: datesReducer,
  status: statusReducer,
  results: resultsReducer,
});

export default rootReducer;