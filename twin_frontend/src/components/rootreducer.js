import { combineReducers } from 'redux';
import datesReducer from './datesreducer';

const rootReducer = combineReducers({
  dates: datesReducer,
});

export default rootReducer;