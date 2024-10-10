import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../utility/imageData";
import PcAdvertisePopup from "../../modal/PcAdvertisePopup/PcAdvertisePopup";
import PCWorkItem from "../../components/PCWorkItem";
import StoreInfo from "../../components/StoreInfo";
import { DataContext } from "../../context/Data";


import { ReadWork } from "../../service/WorkService";
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import Loading from "../../components/Loading";
import { FILTERITMETYPE, INCLUDEDISTANCE, LoadingType, PCMAINMENU } from "../../utility/screen";
import Position from "../../components/Position";
import { WORKNAME } from "../../utility/work";
import { useSelector } from "react-redux";
import { Column } from "../../common/Column";


const Container = styled.div`
  padding:20px 24px 0px 24px;
  min-height:1500px;
`


const style = {
  display: "flex"
};



/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


/**
 * 메인 데이타페이지는 
 * ! currentloading이 false 상태 일때만 보여준다
 * TODO 로딩 타입
 * ① 지역설정 타입 currentloading
 */

const PCMaincontainer =({containerStyle}) =>  {

  const {value} = useSelector((state)=> state.menu);

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [popupstatus1, setPopupstatus1] = useState(false);
  const [popupstatus2, setPopupstatus2] = useState(false);
  const [popupstatus3, setPopupstatus3] = useState(false);

  const [workitems, setWorkitems] = useState([]);
  const [currentloading, setCurrentloading] = useState(false);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setCurrentloading(currentloading);
  },[refresh])

  /**
   * 팝업 노출여부를 확인 한다(hongpopup1, hongpopup2, hongpopup3 를 localstorage에서 가져온다
   * ! 홍여사 요청 업무를 초기 로딩시에 구해온 데이타로 세팅 한다
   * ! 현재 페이지에서 리플레시 햇을때 서버에서 데이타를 구해 올수 있어야 한다 서비스 사용 : ReadWork()
   * 
   */
  useEffect(()=>{
    const now = moment();
    async function FetchLocation(){
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          // Geocoder를 사용하여 좌표를 주소로 변환
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.coord2Address(longitude, latitude, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              const address = result[0].address;

              
              console.log("TCL: FetchLocation -> ", address);
            
              user.address_name = address.address_name;
              user.region_1depth_name = address.region_1depth_name;
              user.region_2depth_name = address.region_2depth_name;
              user.region_3depth_name = address.region_3depth_name;
              user.main_address_no = address.main_address_no;

              geocoder.addressSearch(address.address_name, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                    user.latitude = result[0].y;
                    user.longitude = result[0].x;
                    dispatch(user);
              
                }
              });

              dispatch(user);
              console.log("TCL: FetchLocation -> ", user );
            

         
            }else{
              alert("허용 해야 합니다")
            }
          });
   
        },
        (err) => {
          console.error(err);
        }
      );
    };

    async function FetchData(){
      let time = moment(now).subtract(1, "days").unix();
      const popupdate2 = window.localStorage.getItem("hongpopup2");
      console.log("popupdata", popupdate2/1000, time);
      if (popupdate2 /1000 < time) {
        setPopupstatus2(true);
        console.log("TCL: FetchData -> ",popupstatus2 );
      }

      const popupdate3 = window.localStorage.getItem("hongpopup3");
      console.log("popupdata", popupdate3/1000, time);
      if (popupdate3 /1000 < time) {
        setPopupstatus3(true);
        console.log("TCL: FetchData -> ",popupstatus3 );
      }
      const workitems = data.workitems;

      
      setWorkitems(workitems);



      FetchLocation();

    } 
    FetchData();

  }, [])


  const popupcallback1 = async () => {
    setPopupstatus1(!popupstatus1);
  };

  const popupcallback2 = async () => {
    setPopupstatus2(!popupstatus2);
  };

  const popupcallback3 = async () => {
    setPopupstatus3(!popupstatus3);
  };

  /**
   * useSelector menu 가 변경됨을 감지 함에 따라 호출되는  Hook 함수
   * 데이타를 서버로 부터 불러와서 FilterwokrItems 함수로 걸러진값을 workitems 에 설정 해준다
   */

  useEffect(()=>{
    async function FetchData(){


      const latitude = user.latitude;
      const longitude = user.longitude;
      const checkdistance = INCLUDEDISTANCE;

      const serverworkitems = await ReadWork({latitude, longitude,checkdistance});


    
      let items = FilterWorkitems(value, serverworkitems);
      setWorkitems(items);
    }
    FetchData();
    setRefresh((refresh) => refresh +1);
  },[value])


  /**
   *  필터 값에 의해서 다시 데이타를 정리 해주는 함수
   *  WORKNAME.ALLWORK 인경우는 모든 값을 보여준다
   */
  function FilterWorkitems(filter, workitems){
    let items = [];
    workitems.map((data) =>{

      if(filter == WORKNAME.ALLWORK)
      {
        items.push(data);
      }else{
        if(data.WORKTYPE == filter){
          items.push(data);
        }
      }
    })
    return items;
  }

  /**
   * 단위 일감에서 해당 일감을 클릭햇을때 내주변으로 이동 할수 있도록 한다
   * @param 해당 work_id 와 타입을 보내주어야 한다
   */
  const _handleSelectWork = (WORK_ID) =>{
    navigate("/PCmap" ,{state :{ID :WORK_ID, TYPE : FILTERITMETYPE.HONG}});

  }
  const positioncallback = () =>{
    setCurrentloading(true);
    setRefresh((refresh) => refresh +1);
  } 

  const _handlecurrentloadingcallback = ()=> {
    setCurrentloading(false);
    setRefresh((refresh) => refresh +1);
  }

  function workfilterapply(menu, items){

    let itemsTmp = [];

    if(items == -1){
      return itemsTmp;
    }

    if(menu == WORKNAME.ALLWORK || menu ==''){
      return items;
    }
    items.map((data)=>{
      if(data.WORKTYPE == menu){
        itemsTmp.push(data);
      }
    })

    return itemsTmp;

  }
  return (
    <>
    {
      currentloading == true && <Loading type={LoadingType.CURRENTPOS} callback={_handlecurrentloadingcallback}/>
    }
    {

      <Container style={containerStyle}>
      {popupstatus2 == true ? (
        <PcAdvertisePopup type ={2} callback={popupcallback2} top={'50%'}  left={'35%'} height={'550px'} width={'500px'} image={imageDB.sample11}></PcAdvertisePopup>
      ) : null}

      {popupstatus3 == true ? (
        <PcAdvertisePopup type ={3}  callback={popupcallback3} top={'50%'}  left={'70%'} height={'550px'} width={'500px'} image={imageDB.sample12}></PcAdvertisePopup>
      ) : null}
      <div style={{display:"flex", flexDirection:"column"}}>
          <Position type={PCMAINMENU.HOMEMENU} callback={positioncallback}/>
 
          {
            workitems.length == 0 && <Column style={{height:300}}>
              <img src={Seekimage(value)} style={{width:60}}/>
              <div style={{fontSize:18}}>해당 일감이 존재 하지 않습니다</div>
            </Column>
          }
          <FlexstartRow style={{flexWrap:"wrap"}}>
          {
              workitems.map((item, index)=>(
                <>
                {
                  index < 20 &&           
                  <PCWorkItem key={index}  index={index} width={'21%'} 
                  workdata={item} onPress={()=>{_handleSelectWork(item.WORK_ID)}}/>
                }
                </>
              ))
            }
          </FlexstartRow>
      </div>
      </Container>
    }

    <StoreInfo />
    </>


  );

}

export default PCMaincontainer;

