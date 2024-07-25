import React, { useState, createContext } from "react";

const UserContext = createContext({
  user: {
    email: "",
    uid: "",
    deviceid: "",
    nickname: "",
    latitude: "",
    longitude: "",


  },
  dispatch: () => {},
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const dispatch = ({
    email,
    uid,
    deviceid,
    nickname,
    latitude,
    longitude,
 
  }) => {
    setUser({
      email,
      uid,
      deviceid,
      nickname,
      latitude,
      longitude,
    });
  };

  const value = { user, dispatch };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export { UserContext, UserProvider };
