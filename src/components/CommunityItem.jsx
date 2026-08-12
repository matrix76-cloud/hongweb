import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Column, FlexstartColumn } from "../common/Column";
import { BetweenRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";
import { imageDB } from "../utility/imageData";
import { CiHeart } from "react-icons/ci";
import { FaRegCommentDots } from "react-icons/fa6";

import "./CommunityItem.css"
import { extractTextFromHTML } from "../utility/common";

import TimeAgo from 'react-timeago';
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { getFullTime, WriteTimeCurrentTimeDiff } from "../utility/date";

import moment from 'moment';

const formatter = buildFormatter(koreanStrings); 



const Container = styled.div`

  margin:25px 10px;
`
const style = {
  display: "flex"
};

const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  text-align:left;
  align-items: center;
  font-size: 13px;
  color: #999;
  margin : 5px 0px;
  line-height:1.8;

`
const ImageLayer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0px 0px 0px 10px;
`
const Pictures = styled.div`
  position: absolute;
  color: #fff;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10px;
  background: #0000007d;
  font-weight: 600;
  height: 35px; 
  width: 80px;

`
export const FlexstartConditionColumn = styled.div`
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  justify-content:center;
  width :${({width}) => width};
  padding :${({padding}) => padding};
  
`
const TagDisplay = styled.div`
  font-size: 18px;
  margin-right: 10px;
  border: 1px solid #ededed;
  width: 100px;
  padding: 5px;
  border-radius: 20px;
  background: #ededed;
  color: #423e3e;
  display: flex;
  justify-content: center;
  font-weight: 500;

`




const CommunityItem =({containerStyle, item}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [pictureexpand, setPictureexpand] = useState(false);

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


 const _handlecommunityread = () =>{
  navigate("/PCcommunityread", {state : {COMMUNITY_ID: item.COMMUNITY_ID, COMMUNITYSUMMARY_ID : item.COMMUNITYSUMMARY_ID}});
 }



 
  return (
    <Container style={containerStyle} onClick={()=>{}}>
      <FlexstartRow>
        <div>
          <img src={imageDB.sample2} style={{width:'40px'}}/>
        </div>
        <FlexstartColumn style={{marginBottom:10}}>
            <div>관리자</div>
            <div><TimeAgo date={getFullTime(item.CREATEDT)}formatter={formatter}/></div>
        
        </FlexstartColumn>
        {
          WriteTimeCurrentTimeDiff(item.CREATEDT, 5) == true &&
          <div><img src={imageDB.sample19} style={{width:40}}/></div>
        }
        
      </FlexstartRow>
      
      <Row>
        <FlexstartColumn width={item.REPRESENTIMG != '' ? ('80%') : ('100%')}>
          <FlexstartRow style={{fontSize:20,fontWeight:700}} onClick={_handlecommunityread} >
            <TagDisplay>{item.COMMUNITYCATEGORY}</TagDisplay>

            <div className='CommunityLabel'>
              {item.LABEL.slice(0, 55)}
              {item.LABEL.length > 55 ? "..." : null}
            </div>
          </FlexstartRow>
       

          <ContentRow style={{fontSize:18}}  onClick={_handlecommunityread} className='CommunityContent'>
            {extractTextFromHTML(item.CONTENTSUMMARY).slice(0, 200)}
            {extractTextFromHTML(item.CONTENTSUMMARY).length > 200 ? "..." : null}
          </ContentRow>
        </FlexstartColumn>

      {
        item.REPRESENTIMG != '' &&
        <ImageLayer
        style={{display:"flex", width:"20%",justifyContent:"flex-start", alignItems:"flex-start"}}>
        <img src={item.REPRESENTIMG}
          style={{width:"170px", height:"130px", borderRadius:10}}/>
       
        </ImageLayer>
      }
  
      </Row>



      <FlexstartRow>
        <FlexstartRow>
          <CiHeart size={20}/>
          <div>{'100'}</div>
        </FlexstartRow>
        <FlexstartRow style={{marginLeft:10}}>
          <FaRegCommentDots/>
          <div>{'170'}</div>
        </FlexstartRow>
      </FlexstartRow>

      


    </Container>
  );

}

export default CommunityItem;

