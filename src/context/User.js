import React, { useState, createContext } from "react";

const UserContext = createContext({
  user: {
    deviceid: "",
    nickname: "",
    latitude: "",
    longitude: "",
    address_name : "",
    main_address_no :"",
    region_1depth_name :"",
    region_2depth_name :"",
    region_3depth_name : "",
    token :"",
    phone :"",
    users_id : "",


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
    main_address_no,
    region_1depth_name,
    region_2depth_name,
    region_3depth_name,
    token,
    phone,
    users_id,
 
  }) => {
    setUser({
      deviceid,
      nickname,
      latitude,
      longitude,
      address_name,
      main_address_no,
      region_1depth_name,
      region_2depth_name,
      region_3depth_name,
      token,
      phone,
      users_id,
    });
  };

  const value = { user, dispatch };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export { UserContext, UserProvider };
