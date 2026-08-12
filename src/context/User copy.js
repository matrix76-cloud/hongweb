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
    radius : 5,
    attendance :{},
    worker : false,
    resume :"",
    realname: "",
    juminf:"",
    juminl: "",
    bankuser: "",
    bankname: "",
    banknum: "",
    jumin: "",
    intro :"",



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
    radius,
    attendance,
    worker,
    resume,
    realname,
    jumin,
    intro,


 
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
      radius,
      attendance,
      worker,
      resume,
      realname,
      jumin,
      intro
    });
  };

  const value = { user, dispatch };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export { UserContext, UserProvider };
