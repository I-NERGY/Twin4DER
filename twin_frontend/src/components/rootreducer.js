import { combineReducers } from 'redux';
import datesReducer from './datesreducer';
import logsReducer from './logsreducer';

const rootReducer = combineReducers({
  dates: datesReducer,
  logs: logsReducer,
});

export default rootReducer;