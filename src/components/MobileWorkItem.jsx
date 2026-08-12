import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { BetweenRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";
import { CommaFormatted } from "../utility/money";
import { distanceFunc } from "../utility/region";
import { CiHeart } from "react-icons/ci";
import { imageDB, Seekgrayimage, Seekimage } from "../utility/imageData";
import { BetweenColumn, Column, FlexstartColumn } from "../common/Column";
import { FiEye } from "react-icons/fi";
import { getDateOrTime } from "../utility/date";

import TimeAgo from 'react-timeago';
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { getFullTime, WriteTimeCurrentTimeDiff } from "../utility/date";
import { REQUESTINFO, WORKNAME } from "../utility/work_";
const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`
  background: ${({selected}) => selected == true ?('#ededed'):('#fff')};
  width: ${({width}) => width};
  margin-bottom: 20px;
  border: ${({selected}) => selected == true ?('2px solid #817b79'):('2px solid #F5F5F5')};
  border-radius: 20px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  padding :20px;



`

const KeywordBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  background: #FFF5E5;
  border-radius: 5px;
  margin-right: 5px;
  padding: 4px 6px;
  margin-top: 10px;
  font-size:12px;
`

const TagItem = styled.div`

`
const Tag = styled.div`
  background: #FF7125;
  color: #FFF;
  padding: 4px 8px;
  border-radius: 5px;
  width:81px;
  display:flex;
  font-size:14px;
  justify-content:center;
  align-items:center;
  font-weight:400;
  font-family:"Pretendard-Light";
`
const DisableTag = styled.div`
  background: #F3F3F3;
  color: #A3A3A3;
  padding: 4px 8px;
  border-radius: 5px;
  width:81px;
  display:flex;
  font-size:14px;
  justify-content:center;
  align-items:center;
  font-family:"Pretendard-Light";
`
const style = {
  display: "flex"
};

const WorkType = styled.div`

`
const WorkTypeText = styled.div`
  font-size: 18px;
  font-family:Pretendard-Regular;
  font-weight:700;
  color :#131313;
  line-height:23.4px;
`

const MobileWorkItem =({containerStyle, width, workdata, onPress, index, selected}) =>  {

  const { dispatch, user } = useContext(UserContext);
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

  const _handleworkselect = ()=>{
    console.log("TCL: _handleworkselect -> y", index);
    onPress(index);

  }

  function Distance() {
    const lat1 = user.latitude;
    const lon1 = user.longitude;
    const FindIndex = workdata.WORK_INFO.findIndex(x=>x.requesttype == '지역');
    const lat2 = workdata.WORK_INFO[FindIndex].latitude;;
    const lon2 = workdata.WORK_INFO[FindIndex].longitude;;
    const dist = distanceFunc(lat1, lon1, lat2, lon2);
    return parseFloat(Math.round(dist /1000 * 1000) / 1000);
  }

  function Price(){
    const FindIndex = workdata.WORK_INFO.findIndex(x=>x.requesttype == '금액');
    return workdata.WORK_INFO[FindIndex].result;
  }
  function Comment(){
    const FindIndex = workdata.WORK_INFO.findIndex(x=>x.requesttype == REQUESTINFO.COMMENT);
    return workdata.WORK_INFO[FindIndex].result;
  }

  function Region(){
    const FindIndex = workdata.WORK_INFO.findIndex(x=>x.requesttype == '지역');
    let region  = workdata.WORK_INFO[FindIndex].result;
    let regions = [];
    regions = region.split(' ');

    return regions[1]+' ' + regions[2]+' '+ regions[3];
  }

  function Keyword(){
    let keyworditems = [];
    workdata.WORK_INFO.map((data)=>{
      if(data.requesttype != '지역' && data.requesttype != '금액'
      && data.requesttype != REQUESTINFO.COMMENT
      && data.requesttype != '주기'){

        if(data.requesttype == '도움주실분 성별'){
          data.result ='도움성별 ';

          if(data.result == '여성'){
            data.result +='여성';
          }else if(data.result == '남성'){
            data.result +='남성';    
          }else{
            data.result +='상관없음';  
          }
        }

        if(data.requesttype == '도움주실분 연령대'){
          let guide ='도움연령대 ';

          if(data.result == '상관없음'){
            data.result = "";
            data.result += guide;
            data.result +='상관없음';
          }else if(data.result == '10대'){
            data.result = "";
            data.result += guide;
            data.result +='10대';    
          }else if(data.result == '20대'){
            data.result = "";
            data.result += guide;
            data.result +='20대';    
          }else if(data.result == '30대'){
            data.result = "";
            data.result += guide;
            data.result +='30대';    
          }else if(data.result == '40대'){
            data.result = "";
            data.result += guide;
            data.result +='40대';    
          }else if(data.result == '50대'){
            data.result = "";
            data.result += guide;
            data.result +='50대';    
          }else if(data.result == '60대'){
            data.result = "";
            data.result += guide;
            data.result +='60대';    
          }
        }
        keyworditems.push(data);
      }
    })
    return keyworditems;
  }
 
  return (

    <Container style={containerStyle} width={width} onClick={_handleworkselect} selected={selected}   >


      <Column style={{height:"40%", background:"#fff",width:"100%"}}>
        <Row style={{height:"86px", background:"#fff",width:"100%"}}>
          <FlexstartColumn style={{height:"100%",width:"70%"}}>
            {
              workdata.WORK_STATUS== 0 ? (<TagItem>
                  <Tag>진행중 거래</Tag></TagItem>):(<TagItem><DisableTag>마감된 거래</DisableTag></TagItem>)
            }
            <FlexstartColumn style={{marginTop:14,height:46}}>
              <WorkType><WorkTypeText>{workdata.WORKTYPE}</WorkTypeText></WorkType>
              <div><WorkTypeText>{Price()} 
    
              </WorkTypeText></div>
            </FlexstartColumn>
          </FlexstartColumn>

          <BetweenRow style={{height:"100%", width:"30%"}}>
            <div style={{background:"#F9F9F9", height:80, width:80, borderRadius:80, display:"flex", justifyContent:"center", alignItems:"center"}}>
            {workdata.WORK_STATUS== 0 ? 
              (<img src={Seekimage(workdata.WORKTYPE)} style={{width:52}}/>) : (<img src={Seekgrayimage(workdata.WORKTYPE)} style={{width:52}}/>)
            }
            </div>
          </BetweenRow>
      
        </Row>
      </Column>
      <BetweenRow style={{height:"18px",width:"100%",margin:"14px 0px", color:"#A3A3A3", fontSize:14}}>
        {Comment().slice(0, 25)}
        {Comment().length > 25 ? "..." : null}
      </BetweenRow>

      <div style={{border :"1.5px dashed #ededed", width:"100%"}}></div>

  
      <Column style={{height:"60%", background:"#fff",width:"100%",justifyContent: "start"}}>

        <BetweenRow style={{height:"18px",width:"100%",margin:"14px 0px 0px", color:"#A3A3A3", fontSize:12}} >
        <div>{Region()} / 거리 {Distance()}km </div>
        <div><TimeAgo date={getFullTime(workdata.CREATEDT)}formatter={formatter}/></div>
        </BetweenRow>
        <BetweenRow style={{height:"18px",width:"100%",margin:"14px 0px 0px"}}>
          <Row><img src={imageDB.eyesolid} style={{width:16, height:12}}/>
          <span style={{fontSize:14,paddingLeft:5}}></span>20</Row>
          <Row><span style={{color :"#A3A3A3", paddingRight:10,fontSize:12}}>진행중인 건수</span><span style={{fontFamily:"Pretendard-Bold"}}>5건</span></Row> 
        </BetweenRow>

        <FlexstartRow style={{width:"100%", flexWrap:"wrap"}}>
          {
          Keyword().map((data, index)=>(
            <KeywordBox>
              {data.result.slice(0, 12)}
              {data.result.length > 12 ? "..." : null}
            
            </KeywordBox>
          ))
          }   
        </FlexstartRow>

      </Column>
    </Container>
  );

}

export default MobileWorkItem;

