import {AppActionTypes, AppThunk} from '../types/types';
import {
  getEstimatedAmountThunk,
  getMinimalAmountThunk,
  setAmount,
  setCurrencies,
} from './currencies-reducer';
import {exchangeAPI} from '../api/api';

const SET_ERROR = 'cryptoExchange/app/SET_ERROR';
const SET_APP_STATUS = 'cryptoExchange/app/SET_APP_STATUS';

type PageStateType = {
  error: string | null;
  status: 'loading' | 'idle';
};

const initialState: PageStateType = {
  error: null,
  status: 'loading',
};

const appReducer = (
  state: PageStateType = initialState,
  action: AppActionTypes
): PageStateType => {
  switch (action.type) {
    case SET_ERROR:
      return {...state, error: action.payload.error};

    case SET_APP_STATUS:
      return {...state, status: action.payload.status};

    default:
      return state;
  }
};

export const setError = (payload: {error: string | null}) =>
  ({type: SET_ERROR, payload} as const);

export const setAppStatus = (payload: {status: 'loading' | 'idle'}) =>
  ({type: SET_APP_STATUS, payload} as const);

// Thunks

export const handleErrorThunk =
  (err: {message?: string}): AppThunk =>
  (dispatch) => {
    let error: string;
    if (err.message === 'deposit_too_small') {
      error = 'Deposit too small';
    } else if (err.message === 'null_amount') {
      error = 'This pair is disabled now';
    } else {
      error = 'Network error';
    }
    console.warn(err);
    dispatch(setError({error}));
  };

export const initAppThunk = (): AppThunk => async (dispatch, getState) => {
  dispatch(setAppStatus({status: 'loading'}));
  try {
    const currencies = await exchangeAPI.getCurrencies();
    dispatch(setCurrencies({currencies}));
    await dispatch(getMinimalAmountThunk());
    dispatch(setAmount({amount: getState().currencies.minAmount}));
    await dispatch(getEstimatedAmountThunk());
  } catch (err) {
    dispatch(handleErrorThunk(err));
  } finally {
    dispatch(setAppStatus({status: 'idle'}));
  }
};

export const requestNewDataThunk =
  (showLoader = true): AppThunk =>
  async (dispatch) => {
    dispatch(setError({error: null}));
    try {
      if (showLoader) {
        dispatch(setAppStatus({status: 'loading'}));
      }
      await dispatch(getMinimalAmountThunk());
      await dispatch(getEstimatedAmountThunk());
    } catch (err) {
      dispatch(handleErrorThunk(err));
    } finally {
      dispatch(setAppStatus({status: 'idle'}));
    }
  };

export default appReducer;
