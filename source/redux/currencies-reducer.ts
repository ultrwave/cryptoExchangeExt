import {exchangeAPI} from '../api/api';
import {AppThunk, CurrActionTypes, CurrencyResponseType} from '../types/types';
import {handleErrorThunk} from './app-reducer';

const SET_CURRENCIES = 'cryptoExchange/exchange/SET_CURRENCIES';
const SELECT_CURRENCY = 'cryptoExchange/exchange/SELECT_CURRENCY';
const SWITCH_CURRENCIES = 'cryptoExchange/exchange/SWITCH_CURRENCIES';
const SET_AMOUNT = 'cryptoExchange/exchange/SET_AMOUNT';
const SET_MINIMAL_AMOUNT = 'cryptoExchange/exchange/SET_MINIMAL_AMOUNT';
const SET_ESTIMATED_AMOUNT = 'cryptoExchange/exchange/SET_ESTIMATED_AMOUNT';

export type AmountDisplayType = number | ''

type PageStateType = {
  from: string;
  to: string;
  amount: AmountDisplayType
  minAmount: number;
  estAmount: number;
  availableCurrencies: Array<CurrencyResponseType>;
};

const initialState: PageStateType = {
  from: 'btc',
  to: 'eth',
  amount: 0,
  minAmount: 0,
  estAmount: 0,
  availableCurrencies: [],
};

const currenciesReducer = (
  state: PageStateType = initialState,
  action: CurrActionTypes,
): PageStateType => {
  switch (action.type) {
    case SET_CURRENCIES:
      return {...state, availableCurrencies: action.payload.currencies};

    case SELECT_CURRENCY: {
      const {from, to} = state;
      const shouldSwitch =
        action.payload.field === 'from'
          ? action.payload.value === to
          : action.payload.value === from;
      if (shouldSwitch) {
        return {...state, from: to, to: from, minAmount: 0, estAmount: 0};
      }
      return {...state, [action.payload.field]: action.payload.value};
    }

    case SWITCH_CURRENCIES: {
      const {from, to} = state;
      return {...state, from: to, to: from, minAmount: 0, estAmount: 0};
    }

    case SET_AMOUNT: {
      const {amount} = action.payload;
      return {...state, amount};
    }

    case SET_MINIMAL_AMOUNT:
      return {...state, minAmount: action.payload.minAmount};

    case SET_ESTIMATED_AMOUNT:
      return {...state, estAmount: action.payload.estAmount};

    default:
      return state;
  }
};

export const setCurrencies = (payload: {currencies: CurrencyResponseType[]}) =>
  ({type: SET_CURRENCIES, payload} as const);

export const selectCurrency = (payload: {
  field: 'from' | 'to';
  value: string;
}) => ({type: SELECT_CURRENCY, payload} as const);

export const switchCurrencies = () => ({type: SWITCH_CURRENCIES} as const);

export const setAmount = (payload: {amount: AmountDisplayType}) =>
  ({type: SET_AMOUNT, payload} as const);

export const setMinimalAmount = (payload: {minAmount: number}) =>
  ({type: SET_MINIMAL_AMOUNT, payload} as const);

export const setEstimatedAmount = (payload: {estAmount: number}) =>
  ({type: SET_ESTIMATED_AMOUNT, payload} as const);

// Thunks

export const getMinimalAmountThunk =
  (): AppThunk => async (dispatch, getState) => {
    const {from, to} = getState().currencies;
    const amount = +getState().currencies.amount;
    try {
      const response = await exchangeAPI.getMinimalExchangeAmount( `${from}_${to}`)
      const {minAmount} = response;
      if (minAmount) {
        if (amount < minAmount) {
          dispatch(setAmount({amount: minAmount}));
        }
        return dispatch(setMinimalAmount({minAmount}));
      }
      if (minAmount === null) {
        throw new Error('null_amount');
      }
    } catch (err) {
      dispatch(handleErrorThunk(err))
      return Promise.reject()
    }
  };

export const getEstimatedAmountThunk =
  (): AppThunk => async (dispatch, getState) => {
    const {from, to} = getState().currencies;
    const amount = +getState().currencies.amount;
    try {
      const response = await exchangeAPI.getEstimatedExchangeAmount(amount, `${from}_${to}`)
      const estAmount = response.estimatedAmount;
      if (estAmount) {
        return dispatch(setEstimatedAmount({estAmount}));
      }
      if (estAmount === null) {
        throw new Error('null_amount');
      }
    } catch (err) {
      dispatch(handleErrorThunk(err))
      return Promise.reject()
    }
  };

export default currenciesReducer;
