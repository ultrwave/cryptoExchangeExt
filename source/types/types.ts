import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {RootStateType} from '../redux/store';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootStateType,
  unknown,
  Action<string>
>;

