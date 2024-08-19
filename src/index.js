import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store/store';




const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Provider store ={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </Provider>

  );

// ReactDOM.render(<App />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
