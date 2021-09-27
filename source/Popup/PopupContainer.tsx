import * as React from 'react';
import {ChangeEvent, useEffect, useState} from 'react';
import './styles.scss';
import {useDispatch, useSelector} from 'react-redux';
import {initAppThunk, setError, requestNewDataThunk} from '../redux/app-reducer';
import Popup from './Popup';
import {RootStateType} from '../redux/store';
import {Loader} from './loader';
import {getEstimatedAmountThunk, setAmount, switchCurrencies} from '../redux/currencies-reducer';

const PopupContainer: React.FC = () => {
  const dispatch = useDispatch();
  const [render, setRender] = useState(false);

  useEffect(() => {
    dispatch(initAppThunk());
  }, [dispatch]);

  const appStatus = useSelector((state: RootStateType) => state.app.status);
  const amount = useSelector((state: RootStateType) => state.currencies.amount);
  const minimalAmount = useSelector(
    (state: RootStateType) => state.currencies.minAmount
  );

  const estimatedAmount = useSelector(
    (state: RootStateType) => state.currencies.estAmount
  );

  const error = useSelector((state: RootStateType) => state.app.error);

  const validInput = +amount >= minimalAmount;

  let timeoutId: number;
  useEffect(() => {
    if (amount && render) {
      timeoutId = +setTimeout(() => dispatch(getEstimatedAmountThunk()), 150);
    }
    setRender(!!amount);
    return () => clearTimeout(timeoutId);
  }, [amount]);

  const onChangeCallback = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value === '' ? '' : Number(e.currentTarget.value)
    clearTimeout(timeoutId)
    dispatch(setError({error: null}))
    dispatch(setAmount({amount: value}));
  };

  const onKeyPressCallback = (e: React.KeyboardEvent) => {
    clearTimeout(timeoutId)
    e.key === 'Enter' && dispatch(getEstimatedAmountThunk());
  };

  const onClickSwapCallback = () => {
    dispatch(switchCurrencies());
    dispatch(requestNewDataThunk());
  };

  const fromInputCallbacks = {
    onChange: onChangeCallback,
    onKeyPress: onKeyPressCallback,
  };

  // loader fadeOut

  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    let id = 0
    if (appStatus !== 'loading' && showLoader) {
      id = +setTimeout(() => {
        setShowLoader(false)
      }, 201)
    } else {
      setShowLoader(appStatus === 'loading')
    }
    if (id) {
      return () => clearTimeout(id)
    }
    return () => {}
  }, [appStatus, showLoader])

  return (
    <>
      {showLoader && <Loader />}
      <Popup
        amount={amount}
        estimatedAmount={estimatedAmount}
        validInput={validInput}
        error={error}
        onClickSwap={onClickSwapCallback}
        fromInputCallbacks={fromInputCallbacks}
      />
    </>
  );
};

export default PopupContainer;
