import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Row } from "../../common/Row";
import { UserContext } from "../../context/User";
import { imageDB } from "../../utility/imageData";


import { CONFIGMOVE } from "../../utility/screen";

import MobileUseLaw from "../../components/MobileUseLaw";
import MobilePrivacyLaw from "../../components/MobilePrivacyLaw";
import MobileGpsLaw from "../../components/MobileGpsLaw";

import MobileWorkerInfo from "../../components/config/regist/MobileWorkerInfo";
import MobileProfileConfig from "../../components/config/profile/MobileProfileConfig";
import MobileProfileBadge from "../../components/config/profile/MobileProfileBadge";
import MobileProfileName from "../../components/config/profile/MobileProfileName";
import MobileMyWork from "../../components/config/activity/MobileMyWork";
import { WORKSTATUS } from "../../utility/status";
import MobileSearchRange from "../../components/config/activity/MobileSearchRange";
import MobileNotiSetting from "../../components/config/activity/MobileNotiSetting";
import MobileThemeSetting from "../../components/config/activity/MobileThemeSetting";
import MobileTextSizeSetting from "../../components/config/activity/MobileTextSizeSetting";
import MobileFavoriteWork from "../../components/config/activity/MobileFavoriteWork";
import MobileDealList from "../../components/config/activity/MobileDealList";
import MobilePayList from "../../components/config/money/MobilePayList";
import MobileSupport from "../../components/config/support/MobileSupport";




const Container = styled.div`
  padding-top:55px;
  background-color : var(--bg-soft);


`
const BoxItem = styled.div`

  background: var(--surface);
  color: rgb(0, 0, 0);
  display: flex;
  flex-direction : column;
  width: 85%;
  margin: 10px auto;
  border-radius: 10px;
  padding: 10px;
`
const Name = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: 16px;
  padding-left:5px;
`
const ProfileConfigBtn = styled.div`
  background: var(--bg-soft);
  padding: 10px;
  font-family: 'Pretendard-SemiBold';
  font-size: 12px;
`
const RegistHong = styled.div`
  border: 1px solid rgb(237, 237, 237);
  height: 70%;
  margin: 10px 0px;
  border-radius: 10px;
`
const RegistLayer = styled.div`
  height: 45px;
  background: #ff71255c;
  margin: 10px;
  border: 2px dotted;
  border-radius: 10px;
  display:flex;
  flex-direction : row;
  justify-content : center;
  align-items:center;
`
const RegistLayerContent = styled.div`
  color: #ff7125;
  font-weight: 900;
  font-family: 'Pretendard-Bold';
`
const Label = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: 16px;
  padding: 20px 10px;
`
const SubLabel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding-left: 10px;
`

const SubLabelContent = styled.div`
  font-family: 'Pretendard-Light';
  font-size: 16px;
  padding: 20px 10px;
`




const MobileConfigContentcontainer =({containerStyle, name}) =>  {

  const { dispatch, user } = useContext(UserContext);
  console.log("TCL: MobileConfigcontainer -> user", user)
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    async function FetchData(){
    } 
    FetchData();
  }, [])
  useEffect(()=>{

  },[refresh])

 
  return (

    <Container style={containerStyle}>


        {
          name == CONFIGMOVE.SEARCHRANGE && <MobileSearchRange/>
        }

        {
          name == CONFIGMOVE.NOTISETTING && <MobileNotiSetting/>
        }

        {
          name == CONFIGMOVE.THEMESETTING && <MobileThemeSetting/>
        }
        {
          name == CONFIGMOVE.TEXTSIZESETTING && <MobileTextSizeSetting/>
        }

        {
          name == CONFIGMOVE.FAVORITEWORK && <MobileFavoriteWork/>
        }

        {
          name == CONFIGMOVE.DEALOPEN && <MobileDealList done={false}/>
        }

        {
          name == CONFIGMOVE.DEALDONE && <MobileDealList done={true}/>
        }

        {
          name == CONFIGMOVE.PAY && <MobilePayList kind={'pay'}/>
        }

        {
          name == CONFIGMOVE.DEPOSIT && <MobilePayList kind={'deposit'}/>
        }

        {
          name == CONFIGMOVE.SUPPORT && <MobileSupport kind={'support'}/>
        }

        {
          name == CONFIGMOVE.FAQ && <MobileSupport kind={'faq'}/>
        }

        {
          name == CONFIGMOVE.ABOUT && <MobileSupport kind={'about'}/>
        }
        {
          name == CONFIGMOVE.MYWORK && <MobileMyWork status={WORKSTATUS.OPEN}/>
        }
        {
          name == CONFIGMOVE.CLOSEDWORK && <MobileMyWork status={WORKSTATUS.CLOSE}/>
        }

        {
          name == CONFIGMOVE.LAWPOLICY && <MobileUseLaw/>
        }

        {
          name == CONFIGMOVE.LAWPRIVACY && <MobilePrivacyLaw/>
        }

        {
          name == CONFIGMOVE.LAWGPS && <MobileGpsLaw/>
        }


        {
          name == CONFIGMOVE.WORKERINFO && <MobileWorkerInfo/>
        }

        {
          name == CONFIGMOVE.PROFILECONFIG && <MobileProfileConfig/>
        }

        {
          name == CONFIGMOVE.PROFILENAME && <MobileProfileName/>
        }

        {
          name == CONFIGMOVE.PROFILEBADGE && <MobileProfileBadge/>
        }

    </Container>
  );

}

export default MobileConfigContentcontainer;

