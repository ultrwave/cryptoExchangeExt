import React from 'react';

export type DropdownItemType = {
  currTicker: string;
  currName: string;
  icon: string;
  setCurrencyCallback(): void;
};

const DropdownItem = ({
  currTicker,
  currName,
  icon,
  setCurrencyCallback,
}: DropdownItemType) => {
  const smallFont = currTicker.length > 4;

  return (
    <div className={'searchItem'} onClick={setCurrencyCallback}>
      <img
        src={icon || '../assets/icons/placeholderC.gif'}
        alt={currTicker}
        width={'20px'}
        height={'20px'}
      />
      <span className={`currTicker ${smallFont && 'smallFont'}`}>
        {currTicker.toUpperCase()}
      </span>
      <span className={'currName'}>{currName}</span>
    </div>
  );
};

export default DropdownItem;
