import React, { useState, createContext } from "react";

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

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

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
