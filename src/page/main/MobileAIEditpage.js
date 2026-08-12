import React, {useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";



import MobileAIEditLayout from "../../screen/Layout/Layout/MobileAIEditLayout";
import MobileAIEditcontainer from "../../container/main/MobileAIEditcontainer";





const MobileAIEditpage =() =>  {

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

 
  return (
    
    <MobileAIEditLayout name={''} >
      <div style={{ height: '100%', overflowY: 'auto' }}>
        <MobileAIEditcontainer 
          workeritem={location.state.worker}
          postitem={location.state?.post}
          promptMode={location.state.promptMode}
        />
      </div>
    </MobileAIEditLayout>
    
  );

}

export default MobileAIEditpage;

