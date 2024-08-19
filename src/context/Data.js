import React, { useState, createContext } from "react";

const DataContext = createContext({
  data: {
    communityitems :[],
    workitems :[],
    roomitems :[],
    workmenu : ""

  },
  datadispatch: () => {},
});

const DataProvider = ({ children }) => {
  const [data, setData] = useState({});

  const datadispatch = ({
    communityitems,
    workitems,
    roomitems,
    workmenu,
 
  }) => {
    setData({
      communityitems,
      workitems,
      roomitems,
      workmenu
    });
  };

  const value = { data, datadispatch };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
export { DataContext, DataProvider };
