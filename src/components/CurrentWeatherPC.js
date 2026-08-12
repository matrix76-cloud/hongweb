import React, {memo, Suspense, useContext, useEffect, useLayoutEffect, useState,startTransition } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import { imageDB } from "../utility/imageData";
import { getDateEx2, getDateFullTime } from "../utility/date";
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../common/Row";
import { MiddleAddress, SearchCode, SearchCodeex } from "../utility/region";
import { DataContext } from "../context/Data";
import { Column } from "../common/Column";
import axios from "axios";
import moment from 'moment';
import { LoadingPCLifeSearchAnimationStyle, LoadingSearchAnimationStyle } from "../screen/css/common";
import LottieAnimation from "../common/LottieAnimation";
import { ReadREGIONCODE } from "../service/RegionCodeService";
import { useAtom } from "jotai";
import { fetchDataShortFcst, fetchDataTotalFcst } from "../store/jotai";
import { sleep } from "../utility/common";
import StoreInfo from "./StoreInfo";
import { getFontSize } from '../utility/fontsize';



const Container = styled.div`
  width : 70%;
  margin : 10px auto;
  display : flex;
  flex-direction : row;
`
const DayItemHeader = styled.div`
  line-height:1;
  font-size: ${() => getFontSize(10)}px;
  display: flex;
  justify-content:center;
  flex-direction: row;
  align-items:center;
`
const Label = styled.div`
  font-family : Pretendard-SemiBold;
`
const Summary = styled.div`
    margin-top: 20px;
    padding: 20px;
    font-size: ${() => getFontSize(13)}px;
    line-height: 2;
    background: #00000060;
    white-space: pre-line;
    width: 50%;
    color: #b4afaf;
    margin-bottom: 50px;
    border-radius: 10px;
`
const Info = styled.div`

    margin-bottom: 50px;
    width: 100%;
    max-height: 600px;
    overflow-y: auto;
    background: #00000060;
    margin-left: 20px;
    border-radius: 10px;
    color: #b4afaf;


`


const MiddleRgioncode=[{REGION:"서울", CODE:"11B00000"},
  {REGION:"인천", CODE:"11B00000"},
  {REGION:"경기도", CODE:"11B00000"},
  {REGION:"강원도", CODE:"11D10000"},
  {REGION:"대전", CODE:"11C20000"},
  {REGION:"세종", CODE:"11C20000"},
  {REGION:"충청남도", CODE:"11C20000"},
  {REGION:"충청북도", CODE:"11C10000"},
  {REGION:"광주", CODE:"11F20000"},
  {REGION:"전라남도", CODE:"11F20000"},
  {REGION:"전북자치도", CODE:"11F10000"},
  {REGION:"대구", CODE:"11H10000"},
  {REGION:"경상북도", CODE:"11H10000"},
  {REGION:"부산", CODE:"11H20000"},
  {REGION:"울산", CODE:"11H20000"},
  {REGION:"경상남도", CODE:"11H20000"},
  {REGION:"제주도", CODE:"11G00000"},
  
  
]




const DisplayIcon=({status}) => {

  return(
    <>
      {
        status == '맑음' && <img src={imageDB.lucidity} style={{width:25}}/>
      } 
      {
        status == '흐림' && <img src={imageDB.littlecloud} style={{width:25}}/>
      } 
      {
        (status =="구름많음") && <img src={imageDB.cloud} style={{width:25}}/>
      } 
      {
        (status =='구름많고 비/눈') && <img src={imageDB.rain} style={{width:25}}/>
      } 

    </>
  )
}

const DisplayIcon2=({status}) => {

  return(
    <>
      {
        status <= 2 && <img src={imageDB.lucidity} style={{width:25}}/>
      } 
      {
        (status > 2 && status <=3) && <img src={imageDB.littlecloud} style={{width:25}}/>
      } 
      {
        (status >=4 && status <=8) && <img src={imageDB.cloud} style={{width:25}}/>
      } 
      {
        (status>=9 && status <=10) && <img src={imageDB.rain} style={{width:25}}/>
      } 

    </>
  )
}


const CurrentWeatherPC = memo(({containerStyle, addr, summaryexist, type="climate", location}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [loading, setLoading] = useState(false);
  // const [summaryData, setSummaryData] = useState('');
  // const [shortfcstitems, setShortfcstitems] = useState([]);
  const [midfcstitem, setMidfcstitem] = useState({});
  const [midtemperatefcstitem, setMidtemperatefcstitem] = useState({});
  const [totalFcst, fetchtotalData] = useAtom(fetchDataTotalFcst);
  const [shortfcstitems, fetchshortData] = useAtom(fetchDataShortFcst);
  const [data1, setData1] = useState(null);

  function YearErase(date){
    return date.slice(6, date.length)+'일';
  }

  function TimeErase(time){
    return time.slice(0, 2)+'시';
  }

  function DayRecalculate(type){
    const currentDate = moment();           // 현재 시간
    const futureDate = currentDate.add(type, 'days');  //  더하기

    return futureDate.format('DD일');
  }

  function DayRecalculate2(type){
    const currentDate = moment();           // 현재 시간
    const futureDate = currentDate.subtract(type, 'days');  //  빼기

    return futureDate.format('YYYYMMDD');
  }

  function getShortfcststatus(type){
    const currentDate = moment();  
    if(type == 1){
       let keydata = currentDate.format('YYYYMMDD0600'); 
       const FindIndex = shortfcstitems.findIndex(x=>x.key == keydata);
       console.log("MATRIX LOG : getShortfcststatus : FindIndex:", FindIndex,shortfcstitems,keydata)
       
       return shortfcstitems[FindIndex].items[5].fcstValue;
    }else if(type ==2){
      let keydata =currentDate.format('YYYYMMDD1800'); 
      const FindIndex = shortfcstitems.findIndex(x=>x.key == keydata);
      return shortfcstitems[FindIndex].items[5].fcstValue;
    }else if(type ==3){
      const futureDate = currentDate.add(1, 'days');  //  더하기
      let keydata =futureDate.format('YYYYMMDD0600'); 

      const FindIndex = shortfcstitems.findIndex(x=>x.key == keydata);
      return shortfcstitems[FindIndex].items[5].fcstValue;
    }else if(type ==4){
      const futureDate = currentDate.add(1, 'days');  //  더하기
      let keydata =futureDate.format('YYYYMMDD1800'); 

      const FindIndex = shortfcstitems.findIndex(x=>x.key == keydata);
      return shortfcstitems[FindIndex].items[5].fcstValue;
    }else if(type ==5){
      const futureDate = currentDate.add(2, 'days');  //  더하기
      let keydata =futureDate.format('YYYYMMDD0600'); 
      const FindIndex = shortfcstitems.findIndex(x=>x.key == keydata);
      return shortfcstitems[FindIndex].items[5].fcstValue;
    }else if(type ==6){
      const futureDate = currentDate.add(2, 'days');  //  더하기
      let keydata =futureDate.format('YYYYMMDD1800'); 
      const FindIndex = shortfcstitems.findIndex(x=>x.key == keydata);
      return shortfcstitems[FindIndex].items[5].fcstValue;
    }



  }
  function getShortfcsttemperate(type){
    const currentDate = moment();  
    if(type == 1){
       let keydata = currentDate.format('YYYYMMDD0600'); 
       const FindIndex = shortfcstitems.findIndex(x=>x.key == keydata);
       console.log("MATRIX LOG : getShortfcststatus : FindIndex:", FindIndex,shortfcstitems,keydata)
       
       return shortfcstitems[FindIndex].items[0].fcstValue;
    }else if(type ==2){
      let keydata =currentDate.format('YYYYMMDD1800'); 
      const FindIndex = shortfcstitems.findIndex(x=>x.key == keydata);
      return shortfcstitems[FindIndex].items[0].fcstValue;
    }else if(type ==3){
      const futureDate = currentDate.add(1, 'days');  //  더하기
      let keydata =futureDate.format('YYYYMMDD0600'); 

      const FindIndex = shortfcstitems.findIndex(x=>x.key == keydata);
      return shortfcstitems[FindIndex].items[0].fcstValue;
    }else if(type ==4){
      const futureDate = currentDate.add(1, 'days');  //  더하기
      let keydata =futureDate.format('YYYYMMDD1800'); 

      const FindIndex = shortfcstitems.findIndex(x=>x.key == keydata);
      return shortfcstitems[FindIndex].items[0].fcstValue;
    }else if(type ==5){
      const futureDate = currentDate.add(2, 'days');  //  더하기
      let keydata =futureDate.format('YYYYMMDD0600'); 
      const FindIndex = shortfcstitems.findIndex(x=>x.key == keydata);
      return shortfcstitems[FindIndex].items[0].fcstValue;
    }else if(type ==6){
      const futureDate = currentDate.add(2, 'days');  //  더하기
      let keydata =futureDate.format('YYYYMMDD1800'); 
      const FindIndex = shortfcstitems.findIndex(x=>x.key == keydata);
      return shortfcstitems[FindIndex].items[0].fcstValue;
    }



  }

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setLoading(loading);

  }, [refresh])






  useEffect(()=>{
    fetchtotalData();
    fetchshortData(user.USERINFO.latitude, user.USERINFO.longitude);

  }, [])



  return (
    <>
      <Container style={containerStyle}>
        <>
          {
            totalFcst === '' ? (<LottieAnimation containerStyle={LoadingPCLifeSearchAnimationStyle} animationData={imageDB.loadinglarge}
              width={"100px"} height={'100px'} />) : (<Summary>{totalFcst}</Summary>)
          }

          <div style={{ marginTop: 10, marginBottom: 50, width: "100%", maxHeight: 500, overflowY:"auto" }}>



            {
              (shortfcstitems.length > 0 && type == "climate") && <div style={{ marginTop: 10, marginRight:30 }}>
        
           
                  <Info>
                    {
                      shortfcstitems.map((data, index) => (
                        <BetweenRow style={{padding:20, width:"90%", fontSize: () => getFontSize(13)}}>
                          <div>
                            <Column style={{ lineHeight: 0.9 }}>
                              <div >{YearErase(data.items[0].fcstDate)}{TimeErase(data.items[0].fcstTime)}</div>
                            </Column>
                          </div>
                          <div>{data.items[0].fcstValue}°C</div>
                          <div>{data.items[4].fcstValue}ms</div>
                          <div>
                            <DisplayIcon2 status={data.items[5].fcstValue} />
                          </div>
                          <div>{data.items[10].fcstValue}%</div>
                          <div>{data.items[9].fcstValue}</div>
                        </BetweenRow>


                   

                      ))
                    }

                  </Info>

              </div>
            }


          </div>
        </>
      </Container>


    </>

  );

})

export default CurrentWeatherPC;

