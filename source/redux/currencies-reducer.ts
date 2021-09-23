import {exchangeAPI} from '../api/api';
import {AppThunk} from '../types/types';
import {setError} from './app-reducer';

const SET_CURRENCIES = 'cryptoExchange/exchange/SET_CURRENCIES';
const SELECT_CURRENCY = 'cryptoExchange/exchange/SELECT_CURRENCY';
const SWITCH_CURRENCIES = 'cryptoExchange/exchange/SWITCH_CURRENCIES';
const SET_AMOUNT = 'cryptoExchange/exchange/SET_AMOUNT';
const SET_MINIMAL_AMOUNT = 'cryptoExchange/exchange/SET_MINIMAL_AMOUNT';
const SET_ESTIMATED_AMOUNT = 'cryptoExchange/exchange/SET_ESTIMATED_AMOUNT';

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

type PageStateType = {
  from: string;
  to: string;
  amount: number;
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

export type ActionTypes =
  | ReturnType<typeof setCurrencies>
  | ReturnType<typeof selectCurrency>
  | ReturnType<typeof switchCurrencies>
  | ReturnType<typeof setAmount>
  | ReturnType<typeof setMinimalAmount>
  | ReturnType<typeof setEstimatedAmount>;

const currenciesReducer = (
  state: PageStateType = initialState,
  action: ActionTypes
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

    case SET_AMOUNT:
      return {...state, amount: action.payload.amount};

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

export const setAmount = (payload: {amount: number}) =>
  ({type: SET_AMOUNT, payload} as const);

export const setMinimalAmount = (payload: {minAmount: number}) =>
  ({type: SET_MINIMAL_AMOUNT, payload} as const);

export const setEstimatedAmount = (payload: {estAmount: number}) =>
  ({type: SET_ESTIMATED_AMOUNT, payload} as const);

// Thunks

export const getCurrenciesThunk = (): AppThunk => async (dispatch) => {
  const currencies = await exchangeAPI.getCurrencies();
  dispatch(setCurrencies({currencies}));
};

export const getEstimateAmountThunk =
  (): AppThunk => async (dispatch, getState) => {
    const {from, to, amount, minAmount} = getState().currencies;
    dispatch(setError({error: null}));
    try {
      if (amount < minAmount) {
        dispatch(setError({error: 'Too small deposit'}));
      }
      const response = await exchangeAPI.getEstimatedExchangeAmount(
        amount,
        `${from}_${to}`
      );
      const estAmount = response.estimatedAmount;
      if (estAmount) {
        dispatch(setEstimatedAmount({estAmount}));
      } else if (estAmount === null) {
        dispatch(setError({error: 'this pair is disabled now'}))
      }
    } catch (err) {
      console.warn(err)
      dispatch(setError({error: 'Error'}));
    }
  };

export default currenciesReducer;
