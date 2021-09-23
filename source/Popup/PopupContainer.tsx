import * as React from 'react';
import {useEffect} from 'react';
import './styles.scss';
import {useDispatch, useSelector} from 'react-redux';
import {initAppThunk} from '../redux/app-reducer';
import Popup from './Popup';
import {RootStateType} from '../redux/store';
import {Loader} from './loader';

const PopupContainer: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initAppThunk());
  }, [dispatch]);

  const appStatus = useSelector((state: RootStateType) => state.app.status);

  return (
    <>
      {appStatus !== 'idle' && <Loader />}
      <Popup />
    </>
  );
};

export default PopupContainer;
