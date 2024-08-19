import React, { useState, createContext } from "react";

const UserContext = createContext({
  user: {
    email: "",
    uid: "",
    deviceid: "",
    nickname: "",
    latitude: "",
    longitude: "",
    address_name : "",
    main_address_no :"",
    region_1depth_name :"",
    region_2depth_name :"",
    region_3depth_name : "",


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
    address_name,
    main_address_no,
    region_1depth_name,
    region_2depth_name,
    region_3depth_name,
 
  }) => {
    setUser({
      email,
      uid,
      deviceid,
      nickname,
      latitude,
      longitude,
      address_name,
      main_address_no,
      region_1depth_name,
      region_2depth_name,
      region_3depth_name,
    });
  };

  const value = { user, dispatch };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export { UserContext, UserProvider };
