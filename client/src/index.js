import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';

import { applyMiddleware, createStore } from 'redux';
// 리덕스에서 필요한 미들웨어
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';

// reducer 불러오기
import Reducer from './_reducers'

// redux store를 만드는 과정
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware,ReduxThunk)(createStore);


ReactDOM.render(
  <React.StrictMode>
    {/* Provider를 이용해 리덕스 적용 */}
    <Provider 
      store={createStoreWithMiddleware(Reducer,
        window.__REDUX_DEVTOOLS_EXTENSTION__ &&
        window.__REDUX_DEVTOOLS_EXTENSTION__()  
      )}
    >
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
