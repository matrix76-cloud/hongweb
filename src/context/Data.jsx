import React, { useState, createContext } from "react";

const DataContext = createContext({
  data: {
    communityitems :[],
    workitems :[],
    roomitems :[],
    workmenu : "",
    tourpictureitem :[],
    tourregionitem:[],
    tourfestivalitem :[],
    tourcountryitem :[],
    performanceeventitem : [],
    performancecinemaitem:[],
    hospitalregionitem : [],
    campingregionitem :[]
  

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
    tourpictureitem,
    tourregionitem,
    tourfestivalitem,
    tourcountryitem,
    performanceeventitem,
    performancecinemaitem,
    hospitalregionitem,
    campingregionitem,

 
  }) => {
    setData({
      communityitems,
      workitems,
      roomitems,
      workmenu,
      tourpictureitem,
      tourregionitem,
      tourfestivalitem,
      tourcountryitem,
      performanceeventitem,
      performancecinemaitem,
      hospitalregionitem,
      campingregionitem,
    });
  };

  const value = { data, datadispatch };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
export { DataContext, DataProvider };
