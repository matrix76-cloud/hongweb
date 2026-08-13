import React, { useState, useEffect, createContext } from "react";
import localforage from "localforage";
import { DEMO_USER, FIXED_LOCATION, USE_FIXED_LOCATION, isDemoMode } from "../utility/devLocation";

const UserContext = createContext({
  user: {
    deviceid: "",
    nickname: "",
    latitude: "",
    longitude: "",
    address_name:"",
    token :"",
    phone :"",
    users_id : "",
    userimg :"",


  },
  dispatch: () => {},
});

// 개발 중에는 위치를 다산동으로 채워둔다.
// 스플래시를 거치지 않고 /Mobilemain 으로 바로 들어오면 위치가 비어
// 거리 계산이 NaN 이 되고 일감이 하나도 안 보였다. (형 지적 2026-08-12)
// ?demo=1 이면 데모 계정으로 시작한다 — 리뷰 페이지에서 로그인한 화면을 보기 위함
const INITIAL_USER = isDemoMode()
  ? { ...DEMO_USER }
  : (USE_FIXED_LOCATION
      ? { latitude: FIXED_LOCATION.latitude, longitude: FIXED_LOCATION.longitude, address_name: FIXED_LOCATION.address_name }
      : {});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(INITIAL_USER);

  /**
   * 저장된 계정(userconfig)을 부팅할 때 한 번 읽어 넣는다. (형 지시 2026-08-12)
   *
   * 예전엔 스플래시를 거쳐야만 user 가 채워져서, /Mobilechat 같은 화면으로 바로 들어오면
   * users_id 가 비어 내 대화방을 하나도 못 찾았다. 흐름만 볼 때도 계정이 잡혀 있어야 한다.
   * 스플래시가 나중에 다시 dispatch 하면 그 값이 이긴다.
   */
  useEffect(() => {
    let alive = true;
    localforage.getItem('userconfig')
      .then((saved) => {
        if (!alive || !saved || !saved.users_id) return;
        setUser((prev) => (prev && prev.users_id ? prev : { ...INITIAL_USER, ...saved }));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const dispatch = ({
    deviceid,
    nickname,
    latitude,
    longitude,
    address_name,
    token,
    phone,
    users_id,
    userimg,
 
  }) => {
    setUser({
      deviceid,
      nickname,
      latitude,
      longitude,
      address_name,
      token,
      phone,
      users_id,
      userimg,
    });
  };

  const value = { user, dispatch };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export { UserContext, UserProvider };
