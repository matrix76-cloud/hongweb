import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../utility/imageData";

import { DataContext } from "../../context/Data";


import { findWorkAndFunctionCallFromCurrentPosition, ReadWork } from "../../service/WorkService";
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import Loading from "../../components/Loading";
import { FILTERITMETYPE, INCLUDEDISTANCE, LoadingType, PCMAINMENU } from "../../utility/screen";
import Position from "../../components/Position";
import { WORKNAME, WORKPOLICY } from "../../utility/work";
import { useSelector } from "react-redux";
import { Column, FlexstartColumn } from "../../common/Column";
import MobileWorkItem from "../../components/MobileWorkItem";
import Empty from "../../components/Empty";
import localforage from 'localforage';
import { getDateEx, getDateFullTime } from "../../utility/date";
import { readuserbydeviceid, Readuserbyusersid } from "../../service/UserService";
import { sleep } from "../../utility/common";
import LottieAnimation from "../../common/LottieAnimation";
import { LoadingCommunityStyle, LoadingLifeStyle, LoadingListStyle } from "../../screen/css/common";
import { GoPlus } from "react-icons/go";
import IconButton from "../../common/IconButton";
import MobileRoomItem from "../../components/MobileRoomItem";
import { findRoomAndFunctionCallFromCurrentPosition, ReadRoom } from "../../service/RoomService";
import PCWorkItem from "../../components/PCWorkItem";
import { KeywordAddress } from "../../utility/region";
import {motion} from 'framer-motion';
import { getFontSize } from "../../utility/fontsize";


const Container = styled.div`
  padding:0px 24px 0px 24px;
  margin:70px auto;
  width :70%;

`


const style = {
  display: "flex"
};

const Label = styled.div`
  font-size: ${() => getFontSize(23)}px;
  line-height: 26px;
  font-family:Pretendard-SemiBold;


`
const RegistButton = styled.div`
    height: 50px;
    width: 131px;
    border-radius: 100px;
    background: #FF7125;
    color: #fff;
    margin: 0px auto 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid;
    font-size: ${() => getFontSize(24)}px;
`
const Box = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction:column;
  height: 90px;
  width: 12%;
  margin-right: 10px;
  margin-bottom: 15px;
  margin-top: 15px;
  border-radius: 15px;

`
const BoxImg = styled.div`
  background: #f9f9f9;
  border-radius: 100px;
  background: ${({clickstatus}) => clickstatus == true ? ('#f8f8f8') :('#f8f8f8;') };
  border: ${({clickstatus}) => clickstatus == true ? ('3px solid #ededed') :('') };
  padding: 10px;
`

const FilterEx2 = styled.div`
  position: fixed;
  width: 200px;
  height: 100%;
  z-index: 2;
  padding: 0px 10px;
  bottom: 0px;
  overflow-y: auto;
  right: 0px;
  display: flex;
  flex-direction: row;

`
const ButtonSt = styled.div`

  border: 1px solid #ededed;
  padding: 10px;
  background: ${({enable}) => enable == true ?('#ff7e19'):('#f6f6f6')};
  color: ${({enable}) => enable == true ?('#fff'):('#131313')};
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`

const FilterEx = styled.div`
    position: fixed;
    width: 500px;
    z-index: 10;
    padding: 0px 10px;
    bottom: 50px;
    left: 33%;

`

const ViewBtn = styled.div`
  margin: 20px auto 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  color: #131313;
  height: 47px;
  font-size: ${() => getFontSize(18)}px;
  border : 1px solid;
  font-family: Pretendard-SemiBold;
  width: 33%;
  background: #fff;


`

const PlusButtonLayer = styled.div`
  position: fixed;
  width: 500px;
  z-index: 10;
  padding: 0px 10px;
  bottom: 50px;
  right: 5%;

`

const PlusBtn = styled.div`
  margin: 0px auto 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  color: #fff;
  height: 47px;

  font-family: Pretendard-SemiBold;
  width: 47px;
  background: #ff7e19;
`
const RegistLayer = styled.div`
  color: rgb(255, 126, 25);
  font-family: Pretendard-SemiBold;
  position: fixed;
  bottom: 110px;
  width: 70%;
  background: #fff;
  border: 4px solid #ededed;
  border-radius: 10px;
  z-index :10;
`

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


const WorkItems=[
  {name : WORKNAME.HOMECLEAN, img:imageDB.house},
  {name :WORKNAME.BUSINESSCLEAN, img:imageDB.business},
  {name :WORKNAME.MOVECLEAN, img:imageDB.move},
  {name :WORKNAME.FOODPREPARE, img:imageDB.cook},
  {name :WORKNAME.ERRAND, img:imageDB.help},
  {name :WORKNAME.GOOUTSCHOOL, img:imageDB.gooutschool},
  {name :WORKNAME.BABYCARE, img:imageDB.babycare},
  {name :WORKNAME.LESSON, img:imageDB.lesson},
  {name :WORKNAME.PATIENTCARE, img:imageDB.patientcare},
  {name :WORKNAME.CARRYLOAD, img:imageDB.carry},
  {name :WORKNAME.GOHOSPITAL, img:imageDB.hospital},
  {name :WORKNAME.RECIPETRANSMIT, img:imageDB.recipe},
  {name :WORKNAME.GOSCHOOLEVENT, img:imageDB.schoolevent},
  {name :WORKNAME.SHOPPING, img:imageDB.shopping},
  {name :WORKNAME.GODOGHOSPITAL, img:imageDB.doghospital},
  {name :WORKNAME.GODOGWALK, img:imageDB.dog},
]

/**
 * 메인 데이타페이지는 
 * ! currentloading이 false 상태 일때만 보여준다
 * TODO 로딩 타입
 * ① 지역설정 타입 currentloading
 */

const PCListcontainer =({containerStyle}) =>  {

  const {value} = useSelector((state)=> state.menu);

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [popupstatus, setPopupstatus] = useState(false);

  const [workitems, setWorkitems] = useState([]);
  const [roomitems, setRoomitems] = useState([]);
  const [currentloading, setCurrentloading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [menu, setMenu] = useState(PCMAINMENU.HOMEMENU);

  const [items, setItems] = useState([]);
  const [plusstatus, setPlusstatus] = useState(false);
  const [totalset, setTotalset] = useState(0);

  
  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setCurrentloading(currentloading);
    setSearching(searching);
    setMenu(menu);
    setWorkitems(workitems);
    setRoomitems(roomitems);
    setPlusstatus(plusstatus);
  },[refresh])


  const positioncallback = (data) => {


  }


  useEffect(()=>{

  },[])
  /**
   * useSelector menu 가 변경됨을 감지 함에 따라 호출되는  Hook 함수
   * 데이타를 서버로 부터 불러와서 FilterwokrItems 함수로 걸러진값을 workitems 에 설정 해준다
   */

  useEffect(()=>{

    setSearching(true);
 
    async function FetchData(){




      const latitude = user.USERINFO.latitude;
      const longitude = user.USERINFO.longitude;
      const checkdistance = user.radius;



      const addr = KeywordAddress(user.address_name);
      const currentlatitude = latitude;
      const currentlongitude = longitude;
 
      const workfunctioncall = await findWorkAndFunctionCallFromCurrentPosition({addr, currentlatitude, currentlongitude});
 

      console.log("TCL: FetchData -> useEffect=======>",user,workfunctioncall)

      const serverworkitems = await ReadWork({latitude, longitude,checkdistance});

      if(serverworkitems != -1){
        data.workitems = serverworkitems;
        datadispatch(data);
  
        setWorkitems(serverworkitems);
      }


      setSearching(false);
    }

    FetchData();


    setRefresh((refresh) => refresh +1);
  },[])



  const _handlePlus = () =>{
    setPlusstatus(!plusstatus);
    setRefresh((refresh) => refresh +1);
  }



  const _handleMap =()=>{
    navigate("/PCMap", {state:{ID: "", TYPE:FILTERITMETYPE.HONG}});
  }

  const _handleworkselect = (checkmenu) =>{


    let totalset = 0;

    if(checkmenu == WORKNAME.HOMECLEAN){
      setTotalset(WORKPOLICY.HOMECLEAN);
      totalset = WORKPOLICY.HOMECLEAN;
    }else if(checkmenu == WORKNAME.BUSINESSCLEAN){
      setTotalset(WORKPOLICY.BUSINESSCLEAN);
      totalset = WORKPOLICY.BUSINESSCLEAN;
    }else if(checkmenu == WORKNAME.MOVECLEAN){
      setTotalset(WORKPOLICY.MOVECLEAN);
      totalset = WORKPOLICY.MOVECLEAN;
    }else if(checkmenu == WORKNAME.FOODPREPARE){
      setTotalset(WORKPOLICY.FOODPREPARE);
      totalset = WORKPOLICY.FOODPREPARE;
    }else if(checkmenu == WORKNAME.GOOUTSCHOOL){
      setTotalset(WORKPOLICY.GOOUTSCHOOL);
      totalset = WORKPOLICY.GOOUTSCHOOL;
    }else if(checkmenu == WORKNAME.BABYCARE){
      setTotalset(WORKPOLICY.BABYCARE);
      totalset = WORKPOLICY.BABYCARE;
    }else if(checkmenu == WORKNAME.LESSON){
      setTotalset(WORKPOLICY.LESSON);
      totalset = WORKPOLICY.LESSON;
    }else if(checkmenu == WORKNAME.PATIENTCARE){
      setTotalset(WORKPOLICY.PATIENTCARE);
      totalset = WORKPOLICY.PATIENTCARE;
    }else if(checkmenu == WORKNAME.GOHOSPITAL){
      setTotalset(WORKPOLICY.GOHOSPITAL);
      totalset = WORKPOLICY.GOHOSPITAL;
    }else if(checkmenu == WORKNAME.RECIPETRANSMIT){
      setTotalset(WORKPOLICY.RECIPETRANSMIT);
      totalset = WORKPOLICY.RECIPETRANSMIT;
    }else if(checkmenu == WORKNAME.GOSCHOOLEVENT){
      setTotalset(WORKPOLICY.GOSCHOOLEVENT);
      totalset = WORKPOLICY.GOSCHOOLEVENT;
    }else if(checkmenu == WORKNAME.GODOGHOSPITAL){
      setTotalset(WORKPOLICY.GODOGHOSPITAL);
      totalset = WORKPOLICY.GODOGHOSPITAL;
    }else if(checkmenu == WORKNAME.GODOGWALK){
      setTotalset(WORKPOLICY.GODOGWALK);
      totalset = WORKPOLICY.GODOGWALK;
    }else if(checkmenu == WORKNAME.CARRYLOAD){
      setTotalset(WORKPOLICY.CARRYLOAD);
      totalset = WORKPOLICY.CARRYLOAD;
    }else if(checkmenu == WORKNAME.ERRAND){
      setTotalset(WORKPOLICY.ERRAND);
      totalset = WORKPOLICY.ERRAND;
    }else if(checkmenu == WORKNAME.SHOPPING){
      setTotalset(WORKPOLICY.SHOPPING);
      totalset = WORKPOLICY.SHOPPING;
    }


    setRefresh((refresh) => refresh +1);

    navigate("/PCregist",{state :{WORKTYPE :checkmenu, WORKTOTAL : totalset}});

  }



  /**
   * 단위 일감에서 해당 일감을 클릭햇을때 내주변으로 이동 할수 있도록 한다
   * @param 해당 work_id 와 타입을 보내주어야 한다
   */
  const _handleSelectWork = (WORK_ID) =>{
    navigate("/PCmap" ,{state :{ID :WORK_ID, TYPE : FILTERITMETYPE.HONG}});
  }



  const _handlecurrentloadingcallback = ()=> {
    setCurrentloading(false);
    setRefresh((refresh) => refresh +1);
  }




  return (
    <>
    {
      currentloading == true ? (<Loading type={LoadingType.CURRENTPOS} callback={_handlecurrentloadingcallback}/>)
      :(<>
      <Container style={containerStyle}
       className={`app-container ${plusstatus ? 'blur-background' : ''}`}>
      <div style={{display:"flex", flexDirection:"column"}}>
          <Position type={PCMAINMENU.HOMEMENU} callback={positioncallback}/>

 
          {(searching == true ) ? (<LottieAnimation containerStyle={LoadingListStyle} animationData={imageDB.loadinglarge}
            width={"100px"} height={'100px'} />) :(
              <>
              {
                workitems.length == 0 && 
                <Empty content = "해당일감이 존재 하지 않습니다"
                containerStyle={{marginTop:"150px", marginBottom:500}}
                />
              }
              <Row style={{flexWrap:"wrap", justifyContent:"space-between", alignItems:"flex-start"}}
              className="WorkLayer">
              {
                  workitems.map((item, index)=>(
                
                    <PCWorkItem key={index}  index={index} width={'21%'} 
                      workdata={item} onPress={()=>{_handleSelectWork(item.WORK_ID)}}/>    
                  ))
                }
              </Row>



              {
                plusstatus == true  ?        
                (<RegistLayer>
                  <motion.div
                  key={'point'} // 키가 변경될 때마다 애니메이션 재생
                  initial={{ y: 30, opacity: 0 }}  // 시작 상태 (아래에서 시작)
                  animate={{ y: 0, opacity: 1 }}   // 목표 상태 (위로 올라오면서 나타남)
                  transition={{ type: 'spring', stiffness: 100, duration: 1 }} 
                  
                  >
                  <div >

                    <FlexstartRow style={{paddingLeft:20, paddingTop:20}}>{'도움받을 일을 선택해보세요'}</FlexstartRow>

                  <BetweenRow style={{width:"95%",background:"fff", margin:"0 auto"}}>
                      {
                        WorkItems.map((data, index)=>(
                          <Box onClick={()=>{_handleworkselect(data.name)}} >
                            <BoxImg bgcolor ={data.bgcolor} clickstatus={menu == data.name}><img src={data.img} style={{width:35, height:35}}/></BoxImg>
                            <div style={{ fontSize: () => getFontSize(12), color:"#131313", fontFamily:"Pretendard-SemiBold", marginTop:"5px"}}>{data.name}</div>
                          </Box>
                        ))
                      }
                    </BetweenRow>


                  </div>
                  </motion.div>
                  </RegistLayer>) :(null) 
              }

              <FilterEx>
                <ViewBtn onClick={_handleMap}>지도로 보기</ViewBtn> 
              </FilterEx>


              {/* <PlusButtonLayer>
                <PlusBtn onClick={_handlePlus}>
                {
                  plusstatus == true ? (<div style={{display:"flex",fontSize: () => getFontSize(30)}}>{'-'}</div>):(<div style={{display:"flex",fontSize: () => getFontSize(30)}}>{'+'}</div>)
                }
                </PlusBtn> 
              </PlusButtonLayer> */}

        
 

              </>
           
            )

          }

  




      </div>
      {/* <StoreInfo /> */}
      </Container>
     
      </>)
    }
    </>
  );

}

export default PCListcontainer;

