import {AppThunk} from '../types/types';
import {CurrencyResponseType} from './currencies-reducer';

const SET_SEARCH_ITEMS = 'cryptoExchange/search/SET_SEARCH_ITEMS';

type PageStateType = {
  from: Array<CurrencyResponseType>;
  to: Array<CurrencyResponseType>;
};

const initialState: PageStateType = {
  from: [],
  to: [],
};

export type ActionTypes = ReturnType<typeof setSearchItems>;

const searchReducer = (
  state: PageStateType = initialState,
  action: ActionTypes
): PageStateType => {
  switch (action.type) {
    case SET_SEARCH_ITEMS: {
      return {...state, [action.payload.field]: action.payload.searchItems};
    }

    default:
      return state;
  }
};

export const setSearchItems = (payload: {
  field: 'from' | 'to';
  searchItems: CurrencyResponseType[];
}) => ({type: SET_SEARCH_ITEMS, payload} as const);

// Thunks

export const findCurrenciesThunk = (field: 'from' | 'to', searchValue: string): AppThunk => (dispatch, getState)  => {
  const searchItems = []
  const {availableCurrencies} = getState().currencies
  let i = 0
  while ((searchItems.length < 3 && i < availableCurrencies.length)) {
    const curr = availableCurrencies[i];
    if (`${curr.name} ${curr.ticker}`.toLowerCase().includes(searchValue.toLowerCase())) {
      searchItems.push(curr);
    }
    i += 1
  }
  dispatch(setSearchItems({field, searchItems}))
};

export default searchReducer;
