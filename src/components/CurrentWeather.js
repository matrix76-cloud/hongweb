import React, {memo, useContext, useEffect, useLayoutEffect, useState, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../context/User";
import { imageDB } from "../utility/imageData";
import { getDateEx2, getDateFullTime } from "../utility/date";
import { BetweenRow, FlexEndRow, FlexstartRow } from "../common/Row";
import { MiddleAddress, SearchCode, SearchCodeex } from "../utility/region";
import { DataContext } from "../context/Data";
import { Column } from "../common/Column";
import axios from "axios";
import moment from 'moment';
import { LoadingSearchAnimationStyle } from "../screen/css/common";
import LottieAnimation from "../common/LottieAnimation";
import { ReadREGIONCODE } from "../service/RegionCodeService";
import { fetchDataShortFcst, fetchDataTotalFcst } from "../store/jotai";
import { useAtom } from "jotai";
import { getFontSize } from '../utility/fontsize';

const Container = styled.div`
  margin : 0 auto;
`

const Label = styled.div`
  font-family : Pretendard-SemiBold;
`
const Summary = styled.div`
  margin-top: 20px;
  padding: 20px;
  font-size: ${() => getFontSize(12)}px;
  line-height: 2;
  color: #fff;
`

const Region = styled.div`
  font-size: ${() => getFontSize(28)}px;
  color : #fff;
`
const Temperate = styled.div`
  display : flex;
  flex-direction : row;
  justify-content : center;
  align-items:center;
  font-size: ${() => getFontSize(88)}px;
  color : #fff;

`
const style = `
  .backgroundcontainer {
    background-image: url(${imageDB.SUNNY});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .temperature {
    color: white; /* 텍스트 색상 */
    font-size: ${() => getFontSize(48)}px; /* 텍스트 크기 */
    font-weight: bold; /* 텍스트 두께 */
    font-family: 'Arial', sans-serif; /* 폰트 */
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4); /* 텍스트 그림자 */
    position: relative;
    top: -15px;
}

`
const Infostyle = `


.gradient-background {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    color :#d4d2d2;
}

/* 내용 상자 */
.content-box {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    width: 90%;
    margin-top: 20px;
}
  
}

/* 아이콘 스타일 */
.icon-container {
    font-size: ${() => getFontSize(30)}px;
    margin-bottom: 20px;
}


/* 리스트 */
.content-box ul {
    list-style-type: disc; 
    padding: 0;
    margin: 0;
}

.content-box ul li {
  margin-bottom: 10px;
  font-size: ${() => getFontSize(12)}px;
  margin-left:20px;
  color: #ddd; /* 흐린 텍스트 색상 */
}

/* 하단 텍스트 */
.content-box p {
    margin-top: 20px;
    font-size: ${() => getFontSize(12)}px;
    color: #ddd; /* 흐린 텍스트 색상 */
}
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


const CurrentWeather = memo(({containerStyle, addr, summaryexist, type="climate", location}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */

 console.log("CurrentWeather", addr);

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);

  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [loading, setLoading] = useState(false);



  const [totalFcst, fetchtotalData] = useAtom(fetchDataTotalFcst);
  const [shortfcstitems, fetchshortData] = useAtom(fetchDataShortFcst);


  const _handleprev = () => {
    navigate(-1);
  }

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

  }, [fetchtotalData, fetchshortData])

  return (
    <>
      {totalFcst === '' ? (<LottieAnimation containerStyle={LoadingSearchAnimationStyle} animationData={imageDB.loadinglarge}
        width={"100px"} height={'100px'} />) :
        (<>
          <style>{style}</style>
          <Container style={containerStyle} className="backgroundcontainer">


            <BetweenRow style={{ width: "100%", paddingTop: 20 }}>
              <div style={{ display: "flex", fontSize: '18px', color: "#131313", alignItems: "center", paddingLeft: 15 }}>
                <img src={imageDB.whiteprev} style={{ height: 24 }} onClick={_handleprev} />
                <div style={{ paddingLeft: 5, fontSize: () => getFontSize(20), fontFamily: "Pretendard-SemiBold", color: "#fff" }}>{'날씨정보'}</div>
              </div>

            </BetweenRow>

            <Column style={{ paddingTop: 50 }}>
              <Region>남양주시</Region>
              <Temperate>
                <div>-5</div>
                <div className="temperature">°</div>
              </Temperate>
            </Column>

            <style>{Infostyle}</style>
            {
              summaryexist == true &&
              <div className="gradient-background">
                <div className="content-box">
                  <div style={{ padding: "20px", fontSize: () => getFontSize(12), lineHeight: 2.5 }}>
                    {totalFcst}
                  </div>

                </div>
              </div>
            }

            <div style={{ marginTop: 20, paddingBottom: 10 }} className="gradient-background">
              <div style={{ marginTop: 20 }} className="content-box">
                <div style={{ padding: 20 }}>
                  <BetweenRow>
                    <Label>기상예보</Label>
                    <div style={{ fontSize: () => getFontSize(12), marginBottom: 5 }}>{MiddleAddress(addr)} {getDateFullTime()}기준</div>
                  </BetweenRow>
                  <table className="weather-maintable" style={{ marginTop: 10, border: "none" }}>
                    <thead>
                      <tr>
                        <th>일시</th>
                        <th>기온</th>
                        <th>풍속</th>
                        <th>날씨</th>
                        <th>습도</th>
                        <th>강수</th>

                      </tr>
                    </thead>
                    <tbody>
                      {
                        shortfcstitems.map((data, index) => (
                          <>
                            {(TimeErase(data.items[0].fcstTime) == '06시' || TimeErase(data.items[0].fcstTime) == '12시' || TimeErase(data.items[0].fcstTime) == '18시') &&
                              <tr>
                                <td>
                                  <Column style={{ lineHeight: 1.5, width: 30 }}>
                                    <div >{YearErase(data.items[0].fcstDate)}{TimeErase(data.items[0].fcstTime)}</div>
                                  </Column>
                                </td>
                                <td>{data.items[0].fcstValue}°C</td>
                                <td>{data.items[4].fcstValue}ms</td>
                                <td>
                                  <DisplayIcon2 status={data.items[5].fcstValue} />
                                </td>
                                <td>{data.items[10].fcstValue}%</td>
                                <td>{data.items[9].fcstValue}</td>

                              </tr>
                            }

                          </>


                        ))
                      }

                    </tbody>

                  </table>
                </div>
              </div>
            </div>
          </Container>
        </>)
      }

    </>

  );

})

export default CurrentWeather;

