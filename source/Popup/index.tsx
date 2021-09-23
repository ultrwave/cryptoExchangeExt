import * as React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import store from '../redux/store';
import PopupContainer from './PopupContainer';

ReactDOM.render(
  <Provider store={store}>
    <PopupContainer />
  </Provider>,
  document.getElementById('popup-root')
);
