import {AppThunk} from '../types/types';
import {
  setAmount,
  setCurrencies,
  setEstimatedAmount,
  setMinimalAmount,
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

export type ActionTypes =
  | ReturnType<typeof setError>
  | ReturnType<typeof setAppStatus>;

const appReducer = (
  state: PageStateType = initialState,
  action: ActionTypes
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

export const initAppThunk = (): AppThunk => async (dispatch) => {
  dispatch(setAppStatus({status: 'loading'}));
  try {
    const currencies = await exchangeAPI.getCurrencies();
    dispatch(setCurrencies({currencies}));
    const {minAmount} = await exchangeAPI.getMinimalExchangeAmount('btc_eth');
    dispatch(setAmount({amount: minAmount}));
    dispatch(setMinimalAmount({minAmount}));
    const response = await exchangeAPI.getEstimatedExchangeAmount(
      minAmount,
      'btc_eth'
    );
    const estAmount = response.estimatedAmount;
    dispatch(setEstimatedAmount({estAmount}));
    dispatch(setError({error: null}));
  } catch (error) {
    dispatch(setError({error: error.message}));
  } finally {
    dispatch(setAppStatus({status: 'idle'}));
  }
};

export const updateDataThunk =
  (showLoader = true): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setError({error: null}));
    try {
      if (showLoader) {
        dispatch(setAppStatus({status: 'loading'}));
      }
      const {from, to, amount} = getState().currencies;
      const {minAmount} = await exchangeAPI.getMinimalExchangeAmount(
        `${from}_${to}`
      );
      if (minAmount) {
        dispatch(setMinimalAmount({minAmount}));
        if (amount < minAmount) {
          dispatch(setAmount({amount: minAmount}));
        }
        const response = await exchangeAPI.getEstimatedExchangeAmount(
          Math.max(amount, minAmount),
          `${from}_${to}`
        );
        if (response) {
          const estAmount = response.estimatedAmount;
          dispatch(setEstimatedAmount({estAmount}));
        }
      } else if (minAmount === null) {
        dispatch(setError({error: 'this pair is disabled now'}));
      }
    } catch (err) {
      console.warn(err)
      dispatch(setError({error: 'Error'}));
    } finally {
      dispatch(setAppStatus({status: 'idle'}));
    }
  };

export default appReducer;
