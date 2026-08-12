import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Column, FlexstartColumn } from "../common/Column";
import { BetweenRow, FlexstartRow, Row } from "../common/Row";
import { UserContext } from "../context/User";
import ProfileImage from "./ProfileImage";
import { FaEllipsis } from "react-icons/fa6";
import TimeAgo from 'react-timeago';

import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

import "./Chatgate.css";
import { getFullTime } from "../utility/date";
import { ChatAddress } from "../utility/region";
import ChatprofileImage from "./ChatprofileImage";

const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`
  padding-right: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  background-color: #fff;
  width: 90%;
  margin: 30px auto;
  height:65px;
`
const style = {
  display: "flex"
};

const Name  = styled.div`
  height: 20px;
  font-size: 16px;
  white-space: nowrap;
  color : #131313;
  font-family:'Pretendard-Regular';
`
const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width :300px;
  color :#636363;
  font-size:15px;
  position: relative;
  top: 20px;
  left: 20px;
}

`

const Info = styled.div`
  font-size:12px;
  color :#A3A3A3;
  margin-left:10px;
`

const AddButton = styled.div`
  background: #fff;
  border: 1px solid #eded;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  border-radius: 20px;
  position:absolute;
  left:230px;


`
const SupportTag = styled.div`
  color: #131313;
  padding: 2px 10px;
  border-radius: 15px;
  margin-right: 5px;
  border: 1px solid #ededed;
  margin-left: 10px;
  font-size:12px;

`

// 안읽음 수 — 대화방에 들어가면 0 이 된다
const UnreadBadge = styled.div`
  flex: none;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: #FF4E19;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
  box-sizing: border-box;
`

const OwnerTag = styled.div`
  color: #131313;
  padding: 2px 10px;
  border-radius: 15px;
  margin-right: 5px;
  border: 1px solid #ededed;
  margin-left: 10px;
  font-size:12px;

`





const Chatgate =({containerStyle,item}) =>  {


/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */


  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [showcontrol, setShowcontrol] = useState(false);

  const [img, setImg] = useState('');
  const [name, setName] = useState('');
  const [info, setInfo] = useState(item.CREATEDT);
  const [content, setContent] = useState('');
  const [owner, setOwner] = useState(false);

  const unread = (item.UNREAD && item.UNREAD[user.users_id]) || 0;


  const _handleShowcontrol = ()=>{
    setShowcontrol(true);
    setRefresh((refresh) => refresh +1);
  }

  const _handleHidecontrol = ()=>{
    setShowcontrol(false);
    setRefresh((refresh) => refresh +1);
  }

  useEffect(()=>{
    setShowcontrol(showcontrol);
    setImg(img);
    setName(name);
    setInfo(info);
    setContent(content);
    setOwner(owner);
  }, [refresh]);

  /**
   * 목록 한 줄을 구성한다.
   * 예전엔 여기서 ReadChat 을 다시 불러 전체 방을 또 읽었고, 그 결과가 -1 이면
   * chatItems[chatItems.length-1] 를 건드려 터졌다. 방 정보(item)만으로 그린다. (형 리뷰 2026-08-12)
   */
  useEffect(()=>{

    let nick = "";
    if(item.SUPPORTER_ID == user.users_id){
      nick = item.OWNER.USERINFO.nickname;
      setName(nick);
      setImg(item.OWNER.USERINFO.userimg);
      setOwner(false);
    }else{
      nick = item.SUPPORTER.USERINFO.nickname;
      setName(nick);
      setImg(item.SUPPORTER.USERINFO.userimg);
      setOwner(true);
    }

    // 주고받은 대화가 있으면 마지막 대화를, 없으면 어떻게 시작된 방인지 보여준다
    if(item.LASTMESSAGE){
      setContent(item.LASTMESSAGE);
    }else if(user.users_id == item.OWNER.USERINFO.users_id){
      setContent(item.WORK_INFO.WORKTYPE + "에" +" "+ nick +"님 이 지원하였습니다");
    }else{
      setContent(item.WORK_INFO.WORKTYPE + "에 지원하였습니다");
    }

    setInfo(item.LASTMESSAGE_AT || item.CREATEDT);
    setRefresh((refresh) => refresh +1);

  },[item])



  const _handleChat = () =>{

    let leftimage ="";
    let leftname ="";

    if(owner){

      leftimage = item.SUPPORTER.USERINFO.userimg;
      leftname =item.SUPPORTER.USERINFO.nickname;
 
    }else{

      leftimage = item.OWNER.USERINFO.userimg;
      leftname =item.OWNER.USERINFO.nickname;

    }


    navigate("/Mobilecontent" ,{state :{ITEM :item, OWNER : owner, NAME: name, LEFTIMAGE:leftimage, LEFTNAME:leftname}});

  }


 
  return (

    <Container style={containerStyle} onClick={_handleChat} >
      <ChatprofileImage source={img} containerStyle={{paddingLeft:5}} OWNER={owner} />
      <Column style={{justifyContent:"flex-start", paddingLeft:10}}>
        <BetweenRow style={{width:"100%"}}>
          <FlexstartRow style={{position: "absolute",left: "70px",paddingTop: "15px"}}>
            <Name>{name}</Name>
       
            <Row style={{paddingLeft:20}}>
            {
              owner == true ? (   <div style={{fontWeight:400, fontSize:12, color :"#A3A3A3"}} >
                {ChatAddress(item.SUPPORTER.USERINFO.address_name)}
              </div>)
              :(<div style={{fontWeight:400, fontSize:12, color :"#A3A3A3"}} >
                {ChatAddress(item.OWNER.USERINFO.address_name)}
              </div>)
            }
            <div style={{margin:'0px 5px', color : "#A3A3A3"}}>·</div>
            <TimeAgo date={getFullTime(info)}formatter={formatter} style={{fontWeight:400, fontSize:12, color :"#A3A3A3"}} />
            </Row>

          </FlexstartRow>
          <Info>

          </Info>
        </BetweenRow>
        <Content>
          <div style={{width: "270px",paddingTop: '5px', overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
          {content}
          </div>
          {
            unread > 0 && <UnreadBadge>{unread > 99 ? '99+' : unread}</UnreadBadge>
          }
        </Content>

    
 
      </Column> 
    </Container>
  );

}

export default Chatgate;

