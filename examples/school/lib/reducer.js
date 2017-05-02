import { combineReducers } from 'redux';
import adminGraphite from '../reducers/adminGraphite';

export default function getReducer(client) {
  return combineReducers({
    apollo: client.reducer(),
    adminGraphite,
  });
}
