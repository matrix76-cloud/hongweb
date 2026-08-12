import React, {useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import MobileWorkerLayout from "../../screen/Layout/Layout/MobileWorkerLayout";
import MobileWorkerRegistContainer from "../../container/main/MobileWorkerRegistcontainer";



const promptModeLabelMap = {
  worker: "아르바이트 지원서 수정",
  manual: "직접 프롬프트 입력",
  ability: "아르바이트 능력자 지원",
  video: "자기소개 영상 등록",
  career: "이력사항 등록",
  photos : "참고이미지 등록"
};


const MobileWorkerEditpage =() =>  {

  const navigate = useNavigate();
  const location = useLocation();

  const promptMode = location.state?.promptMode;
  const headerTitle = promptModeLabelMap[promptMode] || "아르바이트 수정";

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

 
  return (
  
    <MobileWorkerLayout name={headerTitle} >
      <div style={{ height: '100%', overflowY: 'auto' }}>
        <MobileWorkerRegistContainer editMode={true} existingData={location.state.worker} promptMode={location.state.promptMode} />
      </div>
    </MobileWorkerLayout>
    
  );

}

export default MobileWorkerEditpage;

