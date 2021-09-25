import * as React from 'react';
import {useState} from 'react';
import '../styles.scss';
import {useDispatch, useSelector} from 'react-redux';
import {RootStateType} from '../../redux/store';
import SearchDropdown from '../Search/SearchDropdown';
import {AmountDisplayType, selectCurrency} from '../../redux/currencies-reducer';
import {updateDataThunk} from '../../redux/app-reducer';

type FieldType = 'from' | 'to';

type InputFieldProps = {
  fieldType: FieldType;
  value: AmountDisplayType;
  readOnly?: boolean
};

const InputField = ({
  value,
  fieldType,
  ...restProps
}: InputFieldProps): JSX.Element => {
  const [showDropdown, setShowDropdown] = useState(false);

  const dispatch = useDispatch();
  const curr = useSelector(
    (state: RootStateType) => state.currencies[fieldType]
  );
  const appStatus = useSelector((state: RootStateType) => state.app.status
  )

  const displayToValue = !value || (appStatus !== 'idle') ? '' : value

  const setCurrency = (field: FieldType) => (currency: string) => {
    dispatch(selectCurrency({field, value: currency}));
    dispatch(updateDataThunk())
  }

  const currencies = useSelector(
    (state: RootStateType) => state.currencies.availableCurrencies
  );
  const image = currencies.find((c) => c.ticker === curr);
  const imageURL = image ? image.image : '';

  const smallFont = curr.length > 3

  return (
    <div className={`field ${fieldType}`}>
      <input value={fieldType === 'from'? value : displayToValue}
             type="number"
             step="any"
             {...restProps} />
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className={'selectCurrency'}
      >
        <div className={'line'} />
        <img
          src={imageURL || '../assets/icons/placeholderC.gif'}
          alt={curr}
          width={'20px'}
          height={'20px'}
        />
        <span className={`currTicker ${smallFont && 'smallFont'}`}>{curr.toUpperCase()}</span>
        <img
          className={`downArrow ${showDropdown ? 'active' : ''}`}
          src={'../assets/icons/downArrow.svg'}
          height={'auto'}
          width={'auto'}
          alt={'arrow'}
        />
      </div>
      {showDropdown && (
        <SearchDropdown
          fieldType={fieldType}
          selectedCurr={curr}
          onBlurCallback={() => setShowDropdown(false)}
          setCurrencyCallback={setCurrency(fieldType)}
        />
      )}
    </div>
  );
};

export default InputField;
