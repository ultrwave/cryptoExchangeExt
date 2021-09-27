import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {RootStateType} from '../redux/store';
import {
  selectCurrency,
  setAmount,
  setCurrencies, setEstimatedAmount,
  setMinimalAmount,
  switchCurrencies,
} from '../redux/currencies-reducer';
import {setAppStatus, setError} from '../redux/app-reducer';
import {setSearchItems} from '../redux/search-reducer';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootStateType,
  unknown,
  Action<string>
>;

export type CurrencyResponseType = {
  ticker: string;
  name: string;
  image: string;
  hasExternalId: boolean;
  isFiat: boolean;
  featured: boolean;
  isStable: boolean;
  supportsFixedRate: boolean;
};


export type AppActionTypes =
  | ReturnType<typeof setError>
  | ReturnType<typeof setAppStatus>;

export type CurrActionTypes =
  | ReturnType<typeof setCurrencies>
  | ReturnType<typeof selectCurrency>
  | ReturnType<typeof switchCurrencies>
  | ReturnType<typeof setAmount>
  | ReturnType<typeof setMinimalAmount>
  | ReturnType<typeof setEstimatedAmount>;

export type SearchActionTypes = ReturnType<typeof setSearchItems>;

export type ActionTypes = AppActionTypes | CurrActionTypes | SearchActionTypes;
