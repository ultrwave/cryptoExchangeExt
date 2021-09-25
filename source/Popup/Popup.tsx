import * as React from 'react';
import {ChangeEvent} from 'react';
import './styles.scss';
import InputField from './InputField/InputField';
import {AmountDisplayType} from '../redux/currencies-reducer';

type PopUpPropsType = {
  amount: AmountDisplayType
  estimatedAmount: number
  validInput: boolean
  error: string | null
  onClickSwap(): void
  fromInputCallbacks: {
    onChange(e: ChangeEvent<HTMLInputElement>): void
    onKeyPress(e: React.KeyboardEvent): void
    onBlur(): void
  }
}

const Popup = ({
  amount,
  estimatedAmount,
  validInput,
  error,
  onClickSwap,
  fromInputCallbacks,
}: PopUpPropsType): JSX.Element => {

  return (
    <section id="popup">
      <h1>Crypto Exchange</h1>
      <h2>Exchange fast and easy</h2>
      <InputField
        fieldType={'from'}
        value={amount}
        {...fromInputCallbacks}
      />
      <img
        className={'swap'}
        onClick={onClickSwap}
        src="../assets/icons/swap.svg"
        alt="swap"
        height={'20px'}
        width={'20px'}
      />
      <InputField
        fieldType={'to'}
        value={validInput ? estimatedAmount : 0}
        readOnly={true}
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
