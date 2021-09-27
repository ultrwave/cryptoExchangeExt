import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import app from './app-reducer';
import currencies from './currencies-reducer';
import search from './search-reducer';
import {useDispatch} from 'react-redux';

export const rootReducer = combineReducers({
  app,
  currencies,
  search,
});

export type RootStateType = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

//@ts-ignore
window.store = store

export default store;
