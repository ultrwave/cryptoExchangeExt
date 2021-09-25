import React from 'react';
import './loader.scss';
import {RootStateType} from '../redux/store';
import {useSelector} from 'react-redux';

export function Loader() {

  const fadeOut = useSelector((state: RootStateType) => state.app.status)

  return (
    <div className={`dimScreen ${fadeOut === 'idle' ? 'hideLoader' : ''}`}>
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
