import React, { Component, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB } from "../../utility/imageData";


import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { CHATCONTENTTYPE, CHATIMAGETYPE, CHATSELECTFILTER, EventItems, PCCOMMNUNITYMENU, PCMAINMENU } from "../../utility/screen";
import Communitymenu from "../../common/Communitymenu";
import CommunityItem from "../../components/CommunityItem";
import Empty from "../../components/Empty";
import Button from "../../common/Button";
import { ReadCommunity, ReadCommunitySummary, ReadCommunityTop10 } from "../../service/CommunityService";
import { DataContext } from "../../context/Data";
import { sleep, useSleep } from "../../utility/common";
import Chatgate from "../../components/Chatgate";
import Emptychat from "../../components/Emptychat";
import { readuser } from "../../service/UserService";
import { NewCreateMessage, ReadChat } from "../../service/ChatService";
import LottieAnimation from "../../common/LottieAnimation";
import { LoadingChatAnimationStyle } from "../../screen/css/common";
import Mobilechatgate from "../../components/Mobilechatgate";
import ButtonEx from "../../common/ButtonEx";
import { getFontSize } from "../../utility/fontsize";
import HongButton from "../../components/HongButton";
import EmptyState from "../../components/EmptyState";
import { COLORS } from "../../utility/colors";



const HEADER_HEIGHT = 44;
const Container = styled.div`
  position: fixed;                        // ✅ 브라우저 툴바 영향 안 받음

  margin-top: ${HEADER_HEIGHT}px; // ✅ 상태바 + 헤더 피함
  height: calc(100vh - ${HEADER_HEIGHT}px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #fff;
  padding: 0 16px;

  width: 90%;
`


const style = {
  display: "flex"
};


const ReadAlertLayout = styled.div`
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap : nowrap;
  margin-right:5px;
  z-index: 3;
  overflow-x: scroll;
  white-space: nowrap;
`
const ReadAlertText = styled.div`
  color:#131313;
  font-size: ${() => getFontSize(14)}px;
`
const FilterLayer = styled.div`
  padding: 10px 12px;
  border-radius: 20px;
  font-size: ${() => getFontSize(16)}px;
  font-family:Pretendard-SemiBold;
  margin-right: 5px;
  background-color : ${({ enable }) => enable == true ? ("#484B53") : ("#F5F6F9")};
  color : ${({ enable }) => enable == true ? ("#fff") : ("#96989C")};



`


const EmptyTitle = styled.div`
    margin-top: 20px;
    font-family: 'Pretendard-SemiBold';
    font-size: ${() => getFontSize(22)}px;
    color: #423f3f;
`

const EmptySubTitle = styled.div`
  margin: 5px 0px;

`

const FilterType = {

}

const ScrollStyle = `
  .scrollable {
    overflow-y: auto; /* 세로 스크롤 허용 */
    -webkit-overflow-scrolling: touch; /* iOS에서 부드러운 스크롤 */
    background-color: #fff;
   
  }
`
const EmptyImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: #fff;
  border-radius: 12px;
`;

const EmptyWrapper = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
  text-align: center;
`;

const EmptyImageStyled = styled.img`
  width: 120px;
  height: 140px;
  object-fit: contain;
  margin-bottom: 20px;
`;

const EmptyTextTitle = styled.div`
  font-size: ${() => getFontSize(18)}px !important;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  font-family: Pretendard-SemiBold;
`;

const EmptyTextSub = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  color: #666;
  margin-bottom: 24px;
`;

const EmptyButtonWrapper = styled.div`
  width: 100%;
  max-width: 260px;
`;


const ActionButton = styled.div`
  padding: 10px 18px;
  font-size: ${() => getFontSize(16)}px !important;
  font-weight: 500;
  background-color: #fff6e0;
  color: #333;
  border: 1px solid #e0d3b8;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.2s ease;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);

  &:hover {
    background-color: #ffeec0;
  }

  &:active {
    background-color: #ffdf96;
  }
`;



const WhiteOrangeButton = styled(ActionButton)`
  background-color: white;
  color: #ff6b00;
  border: 2px solid #ff6b00;

  &:hover {
    background-color: #fff3eb; // 주황 느낌 나는 연한 배경
  }

`;

const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 4px solid #eee;
  border-top: 4px solid ${COLORS.primary}; // ✅ primary 컬러로 교체
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const YouTubeModal = ({ url, onClose }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: 10,
      width: '95%',
      maxWidth: 720 }}>
      <iframe
        width="100%"
        height="450"
        src={url}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div style={{ textAlign: 'right', marginTop: 10 }}>
        <button onClick={onClose} style={{
          padding: '6px 12px',
          borderRadius: 6,
          border: 'none',
          background: '#333',
          color: '#fff'
        }}>닫기</button>
      </div>
    </div>
  </div>
);



const MobileChatcontainer =({containerStyle}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const [visible, setVisible] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [unreadview, setUnreadview] = useState(false);
  const [useritems, setUseritems] = useState([]);
  const [chatitems, setChatitems] = useState([]);
  const [currentloading, setCurrentloading] = useState(true);
  const [switchloading, setSwitchloading] = useState(false);

  const [allselect, setAllselect] = useState(true);
  const [ownerselect, setOwnerselect] = useState(false);
  const [supporterselect, setSupporterselect] = useState(false);
  const [unreadselect, setUnreadselect] = useState(false);

  const [item, setItem] = useState({});
  const [owner, setOwner] = useState(false);
  const [name, setName] = useState('');
  const [leftimage, setLeftimage] = useState('');
  const [leftname, setLeftname] = useState('');
  const [index, setIndex] = useState(0);
  const scrollableRef = useRef(null);

  const [youtubeUrl, setYoutubeUrl] = useState(null);

  const [adminItem, setAdminItem] = useState(null);
  const [longPressTarget, setLongPressTarget] = useState(null);
  const longPressTimer = useRef(null);

  const [showEmptyView, setShowEmptyView] = useState(false);



  useEffect(() => {
    if (chatitems.length === 0) {
      const timer = setTimeout(() => {
        setShowEmptyView(true);
      }, 1000); // 1초 딜레이

      return () => clearTimeout(timer); // 정리
    } else {
      setShowEmptyView(false); // 채팅 있으면 숨김
    }
  }, [chatitems]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 500); // 0.5초 후에 전체 표시 (원하면 조정 가능)
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);



  const _handleUnread = (unread) =>{
    setUnreadview(unread);
  }



  async function FetchData() {
    const USERS_ID = user.USERS_ID;
    const items = await ReadChat({ USERS_ID });



    const adminChatId = `hongyeosa_fixed_${USERS_ID}`;
    const adminChatItem = items.find(item => item.CHAT_ID === adminChatId);


 
    const filteredItems = items.filter(item => {
      if (item.CHAT_ID === adminChatId) return false;

      console.log("Chatcontainer", item);

      const msg = item.message;

      // msg가 EXIT인데 그 보낸 사람이 나인 경우 → 나간 방 → 제거
      if (msg?.CHAT_CONTENT_TYPE === CHATCONTENTTYPE.EXIT && msg?.USERS_ID === USERS_ID) {
        return false;
      }

      // 만약 메시지가 없다거나 이상하면 일단 포함
      return true;
    });


    // 🟡 메시지 기반 읽음 여부 계산
    let read = true;
    let content = "무엇이든 편하게 물어보세요 ☕️";
    let created = null;

    if (adminChatItem?.message) {
      const msg = adminChatItem.message;
      content = msg.TEXT || content;
      created = msg.CREATEDT || null;

      if (msg.USERS_ID === "admin-system-id") {
        read = msg.READ?.includes(USERS_ID); // ✅ 사용자 입장에서 읽었는지 확인
      } else {
        read = true; // 내가 보낸 메시지면 당연히 읽음 상태
      }
    }

    const dynamicAdminFixedChatItem = {
      ...adminChatItem,
      CHAT_ID: adminChatId,
      OWNER_ID: USERS_ID,
      SUPPORTER_ID: "admin-system-id",
      OWNER: {
        USERINFO: {
          nickname: user.USERINFO.nickname,
          userimg: user.USERINFO.userimg,
          address_name: user.USERINFO.address_name || "서울시 강남구",
        },
      },
      SUPPORTER: {
        USERINFO: {
          nickname: "고객지원",
          userimg: imageDB.consumercenter,
          address_name: "운영지원센터",
        },
      },
      INFO: {
        isVirtualWork: true,
      },
      message: {
        CHAT_CONTENT_TYPE: "TEXT",
        TEXT: content,
        CREATEDT: created,
      },
      read, // ✅ 이 값만 사용해서 Mobilechatgate로 넘김
    };

    setAdminItem(dynamicAdminFixedChatItem);

    setChatitems(filteredItems);
    setCurrentloading(false);
  }
  
  async function searchData(type) {

    const USERS_ID = user.USERS_ID;
    const items = await ReadChat({ USERS_ID });

  

    setChatitems(items);


    setCurrentloading(false);


  }
  useEffect(()=>{

    FetchData();
  },[])

  const callback=async (item, owner, name, leftimage, leftname, index)=>{

    setSwitchloading(true);

    await sleep(500);
    setItem(item);
    setOwner(owner);
    setName(name);
    setLeftimage(leftimage);
    setLeftname(leftname);
    setIndex(index);
    setSwitchloading(false);
    setRefresh((refresh) => refresh +1);
  }


  const _handleChatFilter = (filter)=>{
    if(filter == CHATSELECTFILTER.ALL){
      setAllselect(true);
      setOwnerselect(false);
      setSupporterselect(false);
      setUnreadselect(false);

      searchData(CHATSELECTFILTER.ALL);

    }else if(filter == CHATSELECTFILTER.OWNER){

      setAllselect(false);
      setOwnerselect(true);
      setSupporterselect(false);
      setUnreadselect(false);

      searchData(CHATSELECTFILTER.OWNER);

    }else if(filter == CHATSELECTFILTER.SUPPORT){
     
      setAllselect(false);
      setOwnerselect(false);
      setSupporterselect(true);
      setUnreadselect(false);

      searchData(CHATSELECTFILTER.SUPPORT);

    }else if(filter == CHATSELECTFILTER.UNREAD){
      setAllselect(false);
      setOwnerselect(false);
      setSupporterselect(false);
      setUnreadselect(true);

      searchData(CHATSELECTFILTER.UNREAD);
    }

  

  }
  function getcontent(contentitem){
  


    if(contentitem.message == -1 || contentitem.message == undefined) 
    {
      if(user.USERS_ID == contentitem.OWNER.USERINFO.users_id){

        if(contentitem.TYPE == PCMAINMENU.HOMEMENU){
          return contentitem.INFO.WORKTYPE + "에" +" "+ leftname +"님 이 지원하였습니다";
        }else{
          return contentitem.INFO.ROOMTYPE + "에" +" "+ leftname +"님 이 지원하였습니다";
        }
  
      }else{
  
        // 주인이 아니라면
        if(contentitem.TYPE == PCMAINMENU.HOMEMENU){
          return contentitem.INFO.WORKTYPE + "에 지원하였습니다";
        }else{
          return contentitem.INFO.ROOMTYPE + "에 지원하였습니다";
        }
  
  
  
      }
    }else if(contentitem.message.CHAT_CONTENT_TYPE == CHATCONTENTTYPE.IMAGE){
      return "이미지 전송";
    }
    else{

      if(contentitem.message.CHAT_CONTENT_TYPE  == CHATCONTENTTYPE.RIGHTSIGN
      || contentitem.message.CHAT_CONTENT_TYPE  == CHATCONTENTTYPE.PURCHASE
      || contentitem.message.CHAT_CONTENT_TYPE  == CHATCONTENTTYPE.COMPLETE
      || contentitem.message.CHAT_CONTENT_TYPE  == CHATCONTENTTYPE.REVIEW
      || contentitem.message.CHAT_CONTENT_TYPE  == CHATCONTENTTYPE.LEFTSIGN ){
        return contentitem.message.TEXT[0];
      }else{
        return contentitem.message.TEXT;
      }


    }


  }

  function getSelectChat(index_){

    if(index_ == index){
      return true;
    }else{
      return false;
    }
 
  }

  const _handleWorkView = () => {
   

    window.open("https://www.youtube.com/watch?v=8lIY5xMMIB4", "_blank");
  }

  const _handleWorkRegistGuide = () => {
   

    window.open("https://www.youtube.com/watch?v=s14Z7UYqM_U", "_blank");
  }

  const _handleWorkSupportGuide = () => {
  

    window.open("https://www.youtube.com/watch?v=T2TCvdKTECs", "_blank");
  }
 
  const adminFixedChatItem = {
    CHAT_ID: `hongyeosa_fixed_${user.USERS_ID}`,
    OWNER_ID: user.USERS_ID,
    SUPPORTER_ID: "admin-system-id",
    OWNER: {
      USERINFO: {
        nickname: user.USERINFO.nickname,
        userimg: user.USERINFO.userimg,
        address_name: user.USERINFO.address_name || "서울시 강남구"
      }
    },
    SUPPORTER: {
      USERINFO: {
        nickname: "홍여사 고객센터",
        userimg: imageDB.consumercenter,
        address_name: "운영지원센터"
      }
    },
    INFO: {
      isVirtualWork: true
    },
    message: {
      CHAT_CONTENT_TYPE: "TEXT",
      TEXT: "무엇이든 편하게 물어보세요"
    },
    CREATEDT: new Date()
  }


  // ✅ 롱프레스 핸들러
  const handlePressStart = (item) => {

    console.log("handlePressStart", item);
    longPressTimer.current = setTimeout(() => {
      setLongPressTarget(item);
    }, 700); // 0.7초 이상 누르면 팝업 띄움
  };

  const handlePressEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  // ✅ 나가기 처리
  const handleLeaveChat = async(targetItem) => {
    // 실제 나가기 로직 처리
    console.log("채팅방 나가기:", targetItem);

    await NewCreateMessage({
      CHAT_ID: targetItem.CHAT_ID,                      // 🆗 나가는 채팅방 ID
      msg: `${user.USERINFO.nickname}님이 채팅방을 나갔습니다.`, // 🆗 메시지 텍스트
      users_id: user.USERS_ID,                               // 🆗 나가는 사람 ID
      read: [user.USERS_ID],                                 // ✅ 본인만 읽은 상태
      CHAT_CONTENT_TYPE: CHATCONTENTTYPE.EXIT,         // ✅ 타입은 'EXIT'
      AlarmTarget_ID: targetItem.SUPPORTER.USERS_ID    // 🆗 알림 대상은 상대방
    });

    setChatitems(prev => prev.filter(item => item.CHAT_ID !== targetItem.CHAT_ID));

    setLongPressTarget(null);
  };

  const handleMarkAsRead = (targetItem) => {
    // 실제 읽음 처리 로직
    console.log("읽음 처리:", targetItem.CHAT_ID);
    setLongPressTarget(null);
  };
  return (
    <Container style={containerStyle}>

      {/* ✅ 로딩 상태 표시 */}
      {!visible && (
        <div style={{ paddingTop: 100 }}>
          <Spinner />
        </div>
      )}
      
      <div style={{ display: visible ? 'block' : 'none' }}>
            <style>{ScrollStyle}</style>
 
            <Column ref={scrollableRef} className="scrollable" style={{ width:"100%",justifyContent:"flex-start", marginTop:10}}>
    

              <div style={{ width: "100%"}}>
                
                {/* ✅ 항상 나오는 관리자 고정 카드 */}
                {adminItem && (
                  <Mobilechatgate
                    item={adminItem}
                    index={-1}
                    callback={callback}
              
                    read={adminItem.read}  // ✅ 이제 이렇게 읽음 여부 전달
                    content={adminItem.message.TEXT || "무엇이든 편하게 물어보세요"}
                    time={adminItem.message.CREATEDT}

                    select={false}
                    fixed={true}
                  />
                )}

                {
                  chatitems.length != 0 && (
                <>
                  {
                    chatitems.map((item) => (
                      <div
                        key={item.CHAT_ID}
                        onTouchStart={() => handlePressStart(item)}
                        onTouchEnd={handlePressEnd}
                        onMouseDown={() => handlePressStart(item)}
                        onMouseUp={handlePressEnd}
                        onMouseLeave={handlePressEnd}>
                      
                      <Mobilechatgate
                        item={item}
                        index={index}
                        callback={callback} 
                        unReadcount ={item.unReadcount}
                        content={getcontent(item)}
                          select={getSelectChat(index)}
                          
                          time={item.CREATEDT}
                 
                        />
                        </div>
                      
                    ))
                  }
                  </>) 
                }
          </div>
          
          {
            chatitems.length === 0 && showEmptyView && <EmptyState type="chat"/>    
          }
            
       

        
            
            </Column>
 
      </div>
      

      {longPressTarget && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            width: '80%',
            maxWidth: 300,
            overflow: 'hidden'
          }}>
            <div style={{ padding: 16, borderBottom: '1px solid #eee', textAlign: 'center' }} onClick={() => handleMarkAsRead(longPressTarget)}>
              읽음 처리
            </div>
            <div style={{ padding: 16, borderBottom: '1px solid #eee', textAlign: 'center' }} onClick={() => handleLeaveChat(longPressTarget)}>
              채팅방 나가기
            </div>
            <div style={{ padding: 16, textAlign: 'center', fontWeight: 'bold', color: 'red' }} onClick={() => setLongPressTarget(null)}>
              취소
            </div>
          </div>
        </div>
      )}

      {youtubeUrl && <YouTubeModal url={youtubeUrl} onClose={() => setYoutubeUrl(null)} />}
    
    </Container>
  );

}

export default MobileChatcontainer;

