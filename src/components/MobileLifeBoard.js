
import { Table } from "@mui/material";
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { FlexEndRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";

import "./mobile.css"
import { imageDB } from "../utility/imageData";
import LottieAnimation from "../common/LottieAnimation";
import { useSleep } from "../utility/common";
import CurrentMap from "./CurrentMap";
import PCMapPopup from "../modal/PcMapPopup/PcMapPopup";
import { Column, FlexstartColumn } from "../common/Column";
import { DataContext } from "../context/Data";
import MobileMapPopup from "../modal/MobileMapPopup/MobileMapPopup";
import { ReadTourFestival } from "../service/LifeService";
import ResultLabel from "../common/ResultLabel";
import { autoBatchEnhancer } from "@reduxjs/toolkit";
import { ReadCommunitySummary } from "../service/CommunityService";
import TimeAgo from 'react-timeago';
import { getFullTime } from "../utility/date";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { LoadingCommunityStyle } from "../screen/css/common";

const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`

  margin : 0 auto;
  display : flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
  scrollbar-width: none;
  overflow : auto;

`
const style = {
  display: "flex"
};






const Inputstyle ={

  background: '#FFF',
  borderRadius:'5px',
  fontSize: '16px',
  padding: '0px 16px 0px 16px',
  height : '40px',
  border : "1px solid #FF7125",


}


const  SearchLayer = styled.div`
  width: 90%;
  margin : 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #fff;
  position: sticky;
  top: 0px;
  padding-top: 10px;
  padding-bottom: 10px;
  

`

const BoxItem = styled.div`
  padding: 0px 0px 30px;

  margin-bottom: 30px;
  color: #333;
  line-height: 1.8;
  width:100%;
  font-family: "Pretendard-Light";


`
const BoxLabel = styled.div`
  font-family: "Pretendard-SemiBold";
  font-size:16px;
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  width:100%;


`

const BoxContent = styled.div`
  font-family: "Pretendard-Light";
  font-size:14px;

`
const BoxWrite = styled.div`
  display : flex;
  flex-direction : row;
  justify-content: flex-start;
  align-items: center;
  width : 100%;
  font-size :14px;
`

const BoxImage = styled.div`
  margin-top:5px;
`

const LoadingStyle={
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  top: "300px",
  position:"absolute"
}
const MapbtnStyle={
  background: "#ff",
  padding: "0px 20px",
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: '50px',
  color: '#333',
  border :" 1px solid #c3c3c3",
  height: '38px',
  fontSize:'16px',
  fontFamily:'Pretendard-SemiBold',
  width:'30%',
  margin :'20px auto 0px',
}

const Taglabel = styled.div`
  font-family: "Pretendard";
  font-size:12px;
  margin-right:10px;
  min-width:50px;
  display : flex;
  align-items: center;
  justify-content: center;
  background-color:#FFF5F5;
  color :#FF2121;
  border-radius: 5px;

`

const TagData = styled.div`
  font-family: "Pretendard-Light";
  font-size:14px;

  color :#131313;
`
const Item = styled.div`
  margin: 5px 0px;
  display:flex;
  flex-direction: row;
  justify-content:flex-start;
  align-items:center;
`

const MobileLifeBoard =({containerStyle}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);


  const [displayitems, setDisplayitems] = useState([]);

  const [loading, setLoading] = useState(true);


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setDisplayitems(displayitems);
    setLoading(loading);

  },[refresh])
  useEffect(()=>{
      async function FetchData(){
        const communiytitems = await ReadCommunitySummary();
        console.log("TCL: FetchData -> communiytitems", communiytitems);

        setDisplayitems(communiytitems);
        setLoading(false);
      }

      FetchData();
  }, [])

  const _handleBoardView = (data) =>{
    navigate("/Mobilecommunityboard" ,{state :{ITEM :data}});
  }




  return (

    <Container style={containerStyle}>     



        {
          loading == true ? (<LottieAnimation containerStyle={LoadingCommunityStyle} animationData={imageDB.loading}
            width={"50px"} height={'50px'}/>)
          :(
            <Column style={{marginTop:10,width:"100%",margin:"0 auto", paddingTop:"50px"}}>
              <div style={{overflowY:"hidden",width:"90%",margin:"0 auto"}}>
              {
                displayitems.map((data, index)=>(
                    <BoxItem onClick={()=>{_handleBoardView(data)}}>
                      <FlexstartColumn>
                        <BoxLabel>
                          <div>
                          {data.LABEL.slice(0, 20)}
                          {data.LABEL.length > 20 ? "..." : null}
                          </div>
                          <Taglabel>
                            {data.COMMUNITYCATEGORY}
                          </Taglabel>
                              
                        </BoxLabel>
                        <BoxContent>        
                          {data.CONTENTSUMMARY.slice(0, 60)}
                          {data.CONTENTSUMMARY.length > 60 ? "..." : null}
                        </BoxContent>
                        <BoxWrite>
                            <FlexstartRow style={{width:'40%', margin:"5px 0px", justifyContent:"space-between"}}>
                              <Row><img src={imageDB.logo}  style={{width:20}}/></Row>
                              <div>관리자</div>
                              <div>
                              <TimeAgo date={getFullTime(data.CREATEDT)}formatter={formatter}style={{fontWeight:400, fontSize:14, color :"#A3A3A3"}} />
                              </div>
                            </FlexstartRow>
                            <FlexEndRow style={{width:'20%', fontSize:14}}>
                              <img src={imageDB.heartoff} style={{width:16}}/>
                              <div style={{marginLeft:5}}>0</div>
                            </FlexEndRow>
                        </BoxWrite>
                        <BoxImage>
                          <img src={data.REPRESENTIMG} style={{width:"100%", borderRadius:"10px"}}/>
                        </BoxImage>
                      </FlexstartColumn>

                    </BoxItem>
                ))
              }
              </div>  
            </Column>)
        }  
    </Container>
  );

}

export default MobileLifeBoard;

