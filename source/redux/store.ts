import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import currencies from './currencies-reducer';
import app from './app-reducer';

export const rootReducer = combineReducers({
  currencies,
  app,
});

export type RootStateType = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default store;
