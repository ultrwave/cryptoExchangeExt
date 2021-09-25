import * as React from 'react';
import {ChangeEvent, useEffect, useState} from 'react';
import DropdownItem from './DropdownItem';
import {findCurrenciesThunk} from '../../redux/search-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {RootStateType} from '../../redux/store';
import {CurrencyResponseType} from '../../redux/currencies-reducer';

type DropdownPropsType = {
  fieldType: 'from' | 'to'
  selectedCurr: string;
  onBlurCallback(): void;
  setCurrencyCallback(curr: string): void;
};

const SearchDropdown = ({
  fieldType,
  selectedCurr,
  onBlurCallback,
  setCurrencyCallback,
}: DropdownPropsType): JSX.Element => {

  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('');
  const searchItems = useSelector((state: RootStateType) => state.search[fieldType])

  const findCurrencies = (value: string) => dispatch(findCurrenciesThunk(fieldType, value))

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    findCurrencies(selectedCurr.slice(0, 2))
  }, [selectedCurr]);

  useEffect(() => {
    let timeoutId: number;
    if (searchValue) {
      timeoutId = +setTimeout(
        () => findCurrencies(searchValue),
        200
      );
    }
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const items = searchItems.map((el: CurrencyResponseType) => (
    <DropdownItem
      key={el.ticker}
      currTicker={el.ticker}
      currName={el.name}
      icon={el.image}
      setCurrencyCallback={() => setCurrencyCallback(el.ticker)}
    />
  ));

  const onKeyPressCallback = (e: React.KeyboardEvent) => {
    e.key === 'Enter' && findCurrencies(searchValue);
  };

  return (
    <div className="dropdown" onMouseLeave={onBlurCallback}>
      <div className="search">
        <input
          placeholder={'Search'}
          type="text"
          value={searchValue}
          onChange={onChangeHandler}
          onKeyPress={onKeyPressCallback}
        />
        <img
          src="../../assets/icons/close.png"
          alt="close"
          width={'auto'}
          height={'auto'}
          onClick={onBlurCallback}
        />
      </div>
      <div className="dropDownItems">{items}</div>
    </div>
  );
};

export default SearchDropdown;
