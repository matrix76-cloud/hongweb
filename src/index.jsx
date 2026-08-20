import { initTheme } from "./utility/theme";
import { initTextScale } from "./utility/textScale";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store/store';

import { UserProvider } from './context/User';
import { DataProvider } from './context/Data';

/**
 * UserProvider / DataProvider 가 빠져 있어서 useContext 가 createContext 의
 * "기본값"만 돌려주고 있었다. 그래서 user.latitude 가 항상 빈 문자열이었고,
 * dispatch 는 아무 데도 반영되지 않았다(=위치를 잡아도 저장이 안 됨).
 * 일감 목록이 거리 계산(NaN)으로 전부 걸러지던 근본 원인. (2026-08-12)
 */
// 저장해둔 화면 모드를 먼저 입힌다 (형 요청 2026-08-13)
initTheme();

// 저장해둔 글자 크기도 같이 입힌다 (형 지시 2026-08-19)
initTextScale();

/* 앱 안에서 열렸다는 표시. index.css 가 이걸 보고 --safe-bottom 을 0 으로 돌린다.
   앱은 SafeAreaView 로 이미 아래 여백을 주기 때문이다. (2026-08-18) */
if (typeof window !== 'undefined' && window.ReactNativeWebView) {
  document.documentElement.classList.add('in-app');
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <UserProvider>
      <DataProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DataProvider>
    </UserProvider>
  </Provider>
);
