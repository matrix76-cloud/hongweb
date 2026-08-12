import React, { Component, useContext, useEffect, useLayoutEffect, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../utility/imageData";

import { DataContext } from "../../context/Data";

import { Table } from "@mui/material";

import { useSelector } from "react-redux";
import { Column } from "../../common/Column";


import "./MobileMaincontainer.css";
import "./MobileCommunitycontainer.css";

import { useSleep } from "../../utility/common";
import { BOARDMENU, CONVENIENCEMENU, LIFEMENU, MEDICALMENU, PERFORMANCEMENU, TOURISTMENU } from "../../utility/life";
import { getFontSize } from "../../utility/fontsize";

const Container = styled.div`
  padding:50px 0px;
  height: 100%;
`


const style = {
  display: "flex"
};

const FlexMenu = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-x: auto;
  width: 100%;
  scrollbar-width: none;
  margin-top:10px;


`


const Box = styled.div`

  background: ${({clickstatus}) => clickstatus == true ? ('#fff') :('#fff')};
  color :  #131313;
  font-size : 13px;
  font-family : 'Pretendard-Regular';
  font-weight:500;
  border :  ${({clickstatus}) => clickstatus == true ? ('1px solid #F9F9F9') :(null)};
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width:${({clickstatus}) => clickstatus == true ? ('30%') :('30%')};
  height : 100px;
  margin-right: 2px;
  z-index: 2;
  overflow-x: auto;
  flex: 0 0 auto;
  margin-left: 2%;
  margin-bottom: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;

`

const Guide = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  font-family: Pretendard-SemiBold;
  width: 100%;
  align-items: center;
  padding-left: 5%;
  padding-top: 20px;
  padding-bottom: 10px;
  font-size: ${() => getFontSize(18)}px;

`

const CommunityItems =[
  {name : TOURISTMENU.TOURREGION ,img :imageDB.tour},
  {name : TOURISTMENU.TOURFESTIVAL ,img :imageDB.tour},
  {name : TOURISTMENU.TOURCOUNTRY ,img :imageDB.tour},
  {name : TOURISTMENU.TOURPICTURE ,img :imageDB.tour},

  {name : PERFORMANCEMENU.PERFORMANCEEVENT, img : imageDB.performance},
  {name : PERFORMANCEMENU.PERFORMANCECINEMA, img : imageDB.performance},
  {name : MEDICALMENU.MEDICALMEDICINE, img : imageDB.medical},
  {name : MEDICALMENU.MEDICALHOSPITAL, img : imageDB.medical},
  {name : MEDICALMENU.FOODINFOMATION, img : imageDB.medical},

  {name : CONVENIENCEMENU.CONVENIENCECAMPING, img : imageDB.food},

  {name : LIFEMENU.BOARD, img : imageDB.board},

]





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

const MobileLifeItemcontainer =({containerStyle, item}) =>  {

  const {value} = useSelector((state)=> state.menu);

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [currentloading, setCurrentloading] = useState(true);
  const [menu, setMenu] = useState(LIFEMENU.TOUR);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setCurrentloading(currentloading);
    setMenu(menu);

  },[refresh])

  /**

   */
  useEffect(()=>{
    const now = moment();
 
    async function FetchData(){

      await useSleep(1000);
      setCurrentloading(false);
    } 
    FetchData();

  }, [])



  return (
      <Container style={containerStyle}>
        <div style={{display:"flex", flexDirection:"row",width:"100%" }}>


        <Table class="work-table" style={{marginTop:20, height:500}}>
          <tbody>
            <tr>
              <td className="fixed-size">관광지명</td>
              <td>{item.trrsrtNm }</td>
            </tr>    
            {
              item.trrsrtSe != ''&& 
              <tr>
              <td className="fixed-size">관광지 구분</td>
              <td>{item.trrsrtSe }</td>
            </tr> 
            }
            {
              item.trrsrtSe != ''&& 
              <tr>
              <td className="fixed-size">관광지 구분</td>
              <td>{item.trrsrtSe }</td>
            </tr> 
            }
          {
              item.cnvnncFclty != ''&& 
              <tr>
              <td className="fixed-size">공공편익시설정보</td>
              <td>{item.cnvnncFclty }</td>
            </tr> 
            }

            {
              item.stayngInfo != ''&& 
              <tr>
              <td className="fixed-size">숙박시설정보</td>
              <td>{item.stayngInfo }</td>
            </tr> 
            }


            {
              item.mvmAmsmtFclty != ''&& 
              <tr>
              <td className="fixed-size">오락시설정보</td>
              <td>{item.mvmAmsmtFclty }</td>
            </tr> 
            }
            {
              item.recrtClturFclty != ''&& 
              <tr>
              <td className="fixed-size">문화시설정보</td>
              <td>{item.recrtClturFclty }</td>
            </tr> 
            }
            {
              item.hospitalityFclty != ''&& 
              <tr>
              <td className="fixed-size">접객시설정보</td>
              <td>{item.hospitalityFclty }</td>
            </tr> 
            }
            {
              item.sportFclty != ''&& 
              <tr>
              <td className="fixed-size">문화시설정보</td>
              <td>{item.sportFclty }</td>
            </tr> 
            }
                {
              item.aceptncCo != ''&& 
              <tr>
              <td className="fixed-size">문화시설정보</td>
              <td>{item.aceptncCo }</td>
            </tr> 
            }
                {
              item.prkplceCo != ''&& 
              <tr>
              <td className="fixed-size">주차가능수</td>
              <td>{item.prkplceCo }</td>
            </tr> 
            }
                {
              item.trrsrtIntrcn != ''&& 
              <tr>
              <td className="fixed-size">관광지소개</td>
              <td>{item.trrsrtIntrcn }</td>
            </tr> 
            }
                {
              item.phoneNumber != ''&& 
              <tr>
              <td className="fixed-size">전화번호</td>
              <td>{item.phoneNumber }</td>
            </tr> 
            }

            {
              item.institutionNm != ''&& 
              <tr>
              <td className="fixed-size">관리기관</td>
              <td>{item.institutionNm }</td>
            </tr> 
            }



          </tbody>
        </Table>




        {/* <div style={{margin:"20px auto 160px", width:"100%"}}>
          <ButtonEx text={'닫기'} width={'85'}  
          onPress={_handleClose} bgcolor={'#FF7125'} color={'#fff'} />
        </div> */}







        </div>
      </Container>
  );

}

export default MobileLifeItemcontainer;

