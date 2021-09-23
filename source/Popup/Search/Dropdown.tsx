import * as React from 'react';
import {ChangeEvent, useEffect, useState} from 'react';
import DropdownItem from './DropdownItem';
import {CurrencyResponseType} from '../../redux/currencies-reducer';

type DropdownPropsType = {
  selectedCurr: string;
  onBlurCallback(): void;
  setCurrencyCallback(curr: string): void;
  findCurrenciesCallback(searchValue: string): Array<CurrencyResponseType>;
};

const Dropdown = ({
  selectedCurr,
  onBlurCallback,
  findCurrenciesCallback,
  setCurrencyCallback,
}: DropdownPropsType): JSX.Element => {
  const [searchValue, setSearchValue] = useState('');
  const [searchItems, setSearchItems] = useState<Array<CurrencyResponseType>>(
    []
  );

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    let timeoutId: number;
    if (searchValue) {
      timeoutId = +setTimeout(
        () => setSearchItems(findCurrenciesCallback(searchValue)),
        200
      );
    }
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  useEffect(() => {
    setSearchItems(
      findCurrenciesCallback(selectedCurr.slice(0, 2))
    );
  }, [selectedCurr]);

  const items = searchItems.map((el) => (
    <DropdownItem
      key={el.ticker}
      currTicker={el.ticker}
      currName={el.name}
      icon={el.image}
      setCurrencyCallback={() => setCurrencyCallback(el.ticker)}
    />
  ));

  const onKeyPressCallback = (e: React.KeyboardEvent) => {
    e.key === 'Enter' &&
      setSearchItems(findCurrenciesCallback(searchValue));
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

export default Dropdown;
