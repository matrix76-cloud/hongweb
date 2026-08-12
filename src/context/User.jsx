import React, { useState, createContext } from "react";
import { FIXED_LOCATION, USE_FIXED_LOCATION } from "../utility/devLocation";

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
const INITIAL_USER = USE_FIXED_LOCATION
  ? { latitude: FIXED_LOCATION.latitude, longitude: FIXED_LOCATION.longitude, address_name: FIXED_LOCATION.address_name }
  : {};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(INITIAL_USER);

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
