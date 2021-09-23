import * as React from 'react';
import {ChangeEvent, useEffect, useState} from 'react';
import './styles.scss';
import {useDispatch, useSelector} from 'react-redux';
import {
  getEstimateAmountThunk,
  setAmount,
  switchCurrencies,
} from '../redux/currencies-reducer';
import {RootStateType} from '../redux/store';
import InputField from './InputField/InputField';
import {updateDataThunk} from '../redux/app-reducer';

const Popup: React.FC = () => {
  const dispatch = useDispatch();
  const availableCurrencies = useSelector(
    (state: RootStateType) => state.currencies.availableCurrencies
  );

  const [render, setRender] = useState(false);
  const amount = useSelector((state: RootStateType) => state.currencies.amount);
  const minimalAmount = useSelector(
    (state: RootStateType) => state.currencies.minAmount
  );

  const estimatedAmount = useSelector(
    (state: RootStateType) => state.currencies.estAmount
  );

  const error = useSelector((state: RootStateType) => state.app.error);

  const validInput = amount >= minimalAmount;
  const showEstimate = validInput ? estimatedAmount : 0;

  const findCurrenciesCallback = (searchValue: string) => {
    const results = [];
    for (let i = 0; i < availableCurrencies.length; i += 1) {
      const curr = availableCurrencies[i];
      const currName = curr.name.toLowerCase();
      const currTicker = curr.ticker.toLowerCase();
      if (
        currName.includes(searchValue.toLowerCase()) ||
        currTicker.includes(searchValue.toLowerCase())
      ) {
        results.push(curr);
      }
      if (results.length === 3) {
        return results;
      }
    }
    return results;
  };

  const onChangeCallback = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setAmount({amount: Number(e.currentTarget.value)}));
  };

  useEffect(() => {
    let timeoutId: number;
    if (amount && render) {
      timeoutId = +setTimeout(() => dispatch(getEstimateAmountThunk()), 200);
    }
    setRender(!!amount);
    return () => clearTimeout(timeoutId);
  }, [amount]);

  const onKeyPress = (e: React.KeyboardEvent) => {
    e.key === 'Enter' && dispatch(getEstimateAmountThunk());
  };

  const onClickSwitch = () => {
    dispatch(switchCurrencies());
    dispatch(updateDataThunk());
  };

  const fromInputProps = {
    onChange: onChangeCallback,
    onKeyPress,
    onBlur: () => dispatch(getEstimateAmountThunk()),
  };
  const toInputProps = {readOnly: true};

  return (
    <section id="popup">
      <h1>Crypto Exchange</h1>
      <h2>Exchange fast and easy</h2>
      <InputField
        fieldType={'from'}
        value={amount}
        findCurrenciesCallback={findCurrenciesCallback}
        {...fromInputProps}
      />
      <img
        className={'swap'}
        onClick={onClickSwitch}
        src="../assets/icons/swap.svg"
        alt="swap"
        height={'20px'}
        width={'20px'}
      />
      <InputField
        fieldType={'to'}
        value={showEstimate}
        findCurrenciesCallback={findCurrenciesCallback}
        {...toInputProps}
      />
      {validInput || <div className={'inputCross'} />}
      <div className={'field address'}>
        <input className={'address'} placeholder={'Your Etherium address'} />
      </div>
      <button className={'field exchangeBtn'}>
        <span>Exchange</span>
      </button>
      <span className={'errorMsg'}>{error}</span>
    </section>
  );
};

export default Popup;
