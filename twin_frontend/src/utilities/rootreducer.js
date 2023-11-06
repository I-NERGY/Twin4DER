import { combineReducers } from 'redux';
import datesReducer from './datesreducer';
import statusReducer from './statusreducer';

const rootReducer = combineReducers({
  dates: datesReducer,
  status: statusReducer,
});

export default rootReducer;