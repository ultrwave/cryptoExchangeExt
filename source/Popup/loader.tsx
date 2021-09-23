import React from 'react';
import './loader.scss';

export function Loader() {
  return (
    <div className={`dimScreen`}>
      <img
        className={'loader'}
        src={'../assets/icons/appLoader.gif'}
        alt="Loading..."
        height={'auto'}
        width={'auto'}
      />
    </div>
  );
}
