import React, { Component, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../utility/imageData";
import PcAdvertisePopup from "../../modal/PcAdvertisePopup/PcAdvertisePopup";
import PCWorkItem from "../../components/PCWorkItem";
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { CHATCONTENTTYPE, CHATIMAGETYPE, EventItems, PCCOMMNUNITYMENU } from "../../utility/screen";
import Communitymenu from "../../common/Communitymenu";
import CommunityItem from "../../components/CommunityItem";
import Empty from "../../components/Empty";
import Button from "../../common/Button";
import { ReadCommunity, ReadCommunitySummary, ReadCommunityTop10 } from "../../service/CommunityService";
import { DataContext } from "../../context/Data";
import { useSleep } from "../../utility/common";
import Chatgate from "../../components/Chatgate";
import { distanceFunc } from "../../utility/region";
import { CommaFormatted } from "../../utility/money";
import MobileContact from "../../modal/MobileContactPopup/MobileContactPopup";
import { WORKNAME,REQUESTINFO } from "../../utility/work";
import {
  SlShield,
  SlPaperClip,
  SlLogout,
  SlUserUnfollow,
} from "react-icons/sl";
import { CreateMessage } from "../../service/ChatService";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../api/config";
import { getDateFullTime, getTime, getDate } from "../../utility/date";
import LottieAnimation from "../../common/LottieAnimation";
import { LoadingChat2AnimationStyle, LoadingChatAnimationStyle } from "../../screen/css/common";
import { uploadImage } from "../../service/UploadService";
import MobileWarningPopup from "../../modal/MobileWarningPopup/MobileWarningPopup";
import { setRef } from "@mui/material";
import MobileContactSign from "../../modal/MobileContactSignPopup/MobileContactSignPopup";
import MobileContactDoc from "../../modal/MobileContactDocPopup/MobileContactDocPopup";
import MobilePayPopup from "../../modal/MobilePayPopup/MobilePayPopup";

const Container = styled.div`
    background-color : #fff;
    height:900px;
    padding-top:50px;
`
const style = {
  display: "flex"
};


const ReadAlertLayout = styled.div`
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #ededed;
  margin-right:5px;

  padding-left:20%;


`
const ReadAlertText = styled.div`
  color:#131313;
  font-size:16px;
`


const InfoBox = styled.div`
  font-size: 14px;
  margin: 15px 0px 5px;
  border:  1px solid #ededed;
  margin: 10px auto;
  width: 85%;
  padding: 10px;
  text-align: left;
  line-height: 2;
  border-radius: 10px;
  color: #131313;

`

const ItemLeftlayer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top:10px;
  width:${({width}) => width};
`
const ItemLeftBox = styled.div`
background: #fff;
border-radius: 10px;
padding: 20px;
margin: 5px 10px 0px;
color: #131313;
display: flex;
flex-direction: column;
width: ${({width}) => width};
font-size: 16px;
text-align: left;
min-width:220px;
font-weight:400;


`;
const ItemRightLayer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: 5px;
  margin-bottom: 5px;
`;
const ItemRightBox = styled.div`
  background: #FFF;
  border-top-right-radius: 0px;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border : 1px solid #F75100;
  padding: 10px 16px;
  margin: 10px 10px 0px;
  color: #000;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  font-size: 16px;
  text-align: left;
`;

const Enter = styled.div`
  text-align: left;
  padding: 10px;
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
  display:flex;
  position:fixed;
  background-color :white;
  width: 100%;
  height:80px;
`

const EnterButton = styled.div`
display: flex;
flex-direction: row;
width: 30%;
/* height: 80px; */
justify-content: flex-end;
align-items: flex-end;
padding-right: 15px;
position: absolute;
left: 65%;
position: absolute;
left: 65%;
top: 60px;


`
const StoreName = styled.div`
  font-size: 14px;
  font-weight: 600
`
const StoreAddr = styled.div`
  font-size: 12px;
  color :#aba8a8;

`
const StorePrice = styled.div`
font-size: 14px;
`

const StoreIntroduce = styled.div`
  font-size: 14px;

`

const Content = styled.div`
  padding-top:120px;
`
const SupportTag = styled.div`
  background: #FF7125;
  font-size: 12px;
  color: #fff;
  padding: 2px 10px;
  border-radius: 15px;
  margin-right: 5px;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;

`

const OwnerTag = styled.div`
  background: #25a3ff;
  font-size: 12px;
  color: #fff;
  padding: 2px 10px;
  border-radius: 15px;
  margin-right: 5px;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;

`
const BottomLine = styled.div`
  height: 50px;
  background-color: white;
  position: fixed;
  width: 100%;
  bottom: 0;
  border-top: 1px solid #ededed;
`;
const ChatbtnLayer = styled.div`
  display: flex;

  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  position: relative;

`;
const ChatIconLayer = styled.div`
  display: flex;
  flex-direction: row;
  width: 60px;
  justify-content: space-around;
  padding-left:10px;
`;

const InputChat = styled.textarea`
  width: 100%;
  resize: none;
  border: none;
  outline: 0;
  font-family: "SF-Pro-Text-Regular";
  font-size: 16px;
  padding: 10px;
  color :#999;
`;

const ShowContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom:100px;
  width:100%;

`;

const ItemLayerA = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 5px;
  margin-bottom:5px;
`;
const ChatUserImg = styled.div`
  display: flex;
  justify-content: flex-start;
  color: #000;
  padding-left: 10px;
  font-size: 12px;
`;
const ItemLayerAname = styled.div`
  justify-content: flex-start;
  font-size: 12px;
  flex-direction: row;
  display: flex;
  padding-left: 10px;
`;
const ItemLayerAcontent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;
const ItemLayerAdate = styled.div`
  font-size: 10px;
  width: 100px;
  display: flex;
  justify-content: flex-start;
  padding-bottom:10px;
  color:#A3A3A3;
  flex-direction:column;
`;

const ItemLayerB = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const ItemLayerBBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;


`;

const ItemBoxA = styled.div`
  background: #F9F9F9;
  border-radius: 10px;
  padding: 10px;
  margin: 5px 10px 0px 5px;
  color: #131313;
  display: flex;
  flex-direction: column;
  width: 60%;
  font-size: 14px;
  text-align: left;
`;

const ItemBoxB = styled.div`
  background: #FFE477;
  border-radius: 10px;
  padding: 10px;
  margin: 10px 10px 0px;
  color: #131313;
  display: flex;
  flex-direction: column;
  max-width: 50%;
  justify-content: flex-end;
  font-size: 14px;
  text-align: left;
`;


const ItemLayerBdate = styled.div`
  font-size: 10px;
  display: flex;
  justify-content: flex-end;
  padding-bottom: 2px;
  color:#A3A3A3;
  flex-direction:column;
  
`;

const MobileContentcontainer =({containerStyle, ITEM, OWNER, LEFTIMAGE, LEFTNAME}) =>  {

  const { dispatch, user } = useContext(UserContext);
  const { datadispatch, data} = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [contactpopup, setContactpopup] = useState(false);
  const [contactsignpopup, setContactsignpopup] = useState(false);
  const [contactwritepopup, setContactwritepopup] = useState(false);
  const [paypopup, setPaypopup] = useState(false);
  const [downloadpopup, setDownloadpopup] = useState(false);

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatid, setChatid] = useState(ITEM.CHAT_ID);

  const [leftname, setLeftname] = useState('');
  const [leftimage, setLeftimage] = useState('');

  const [currentloading, setCurrentloading] = useState(false);
  const [registimgfail, setRegistimgfail] = useState(false);



  const fileInput = useRef();




  useEffect(()=>{
    setLeftimage(leftimage);
    setLeftname(leftname);
    setCurrentloading(currentloading);
    setRegistimgfail(registimgfail);
    setContactsignpopup(contactsignpopup);
    setContactwritepopup(contactwritepopup);
    setPaypopup(paypopup);
    setDownloadpopup(downloadpopup);
  }, [refresh])


  useEffect(() => {
    const q = query(
      collection(db, `CHAT/${chatid}/messages`),
      orderBy("CREATEDAT", "asc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push(doc.data());

      });

      // 자신이 read 사용자에 없다면 자신을 read로 업데이트 하자
     

      setMessages(list);

     if(list.length < 5){
      window.scrollTo(0, 0);
     }else{
      window.scrollTo(0, document.body.scrollHeight);
     }
    

     
    });

    return () => unsubscribe();
  }, []);


  
  useLayoutEffect(() => {
    if (messages.length > 10) {
          window.scrollTo(0, document.body.scrollHeight);  
    }

  })

  const handleUploadClick = (e) => {
    fileInput.current.click();
  };

  const ALLOW_IMAGE_FILE_EXTENSION = "jpg,jpeg,png,bmp";

  const ImagefileExtensionValid = (name) => {
    const extention = removeFileName(name);

    if (
      ALLOW_IMAGE_FILE_EXTENSION.indexOf(extention) <= -1 ||
      extention == ""
    ) {
      return false;
    }
    return true;
  };
  const removeFileName = (originalFileName) => {
    const lastIndex = originalFileName.lastIndexOf(".");

    if (lastIndex < 0) {
      return "";
    }
    return originalFileName.substring(lastIndex + 1).toLowerCase();
  };

  const ImageUpload = async (data, data2) => {
    const uri = data;
    const email = data2;
    const URL = await uploadImage({ uri, email });
    return URL;
  };
  
  
  const handlefileuploadChange = async (e) => {
    let filename = "";
    const file = e.target.files[0];
    filename = file.name;


    if (!ImagefileExtensionValid(filename)) {

      setRegistimgfail(true);
      setRefresh((refresh) => refresh +1);
      return;
    }

    var p1 = new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let img = reader.result;
        resolve(img);
      };
    });
    const getRandom = () => Math.random();
    const email = getRandom();

    p1.then(async (result) => {
      const uri = result;
      console.log("uri", uri);

      let msg = await ImageUpload(uri, email);
      const IMGTYPE = true;

      let read= [];
      read.push(user.users_id);


      try {
  
        const CHAT_ID = chatid;
        const CHAT_CONTENT_TYPE = CHATCONTENTTYPE.IMAGE;
  
 
        const users_id = user.users_id;
        await CreateMessage({
          CHAT_ID,
          msg,
          users_id,
          read,
          CHAT_CONTENT_TYPE,
        
        });
      } catch (e) {
        console.log("error", e);
      }
    });
  };

  const _handlesend = async () => {

    if (message == '') {
      return;
    }
    const msg = message;
    setRefresh((refresh) => refresh + 1);

    let read= [];
    read.push(user.users_id);



    document.getElementById('yourTextInputId').blur();
    document.getElementById('yourTextInputId').focus();

    try {
  
      const CHAT_ID = chatid;
      const CHAT_CONTENT_TYPE = CHATCONTENTTYPE.TEXT;

      const users_id = user.users_id;
      await CreateMessage({
        CHAT_ID,
        msg,
        users_id,
        read,
        CHAT_CONTENT_TYPE,
      
      });
    } catch (e) {
      console.log("error", e);
    }
    setMessage("");
  };


  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setContactpopup(contactpopup);
  },[refresh])


  useEffect(()=>{
    async function FetchData(){
  
    }
    FetchData();
  }, [])
  const _handlebuy = () =>{

  }
  const _handleapply = () =>{
    
  }
  const _handlelicense = () =>{
    
  }

  // 메인 다이랄로그 열기 위해 사용
  const _handlecontact = () =>{
    setContactpopup(true);
    setRefresh((refresh) => refresh +1 );
  }
  // 메인 다이랄로그 닫기 위해 사용
  const MobileContactCallback = () =>{
    setContactpopup(false);
    setRefresh((refresh) => refresh +1 );
  }

  /**
   * 열기위해 사용
   */
  const MobileContactsignCallbackOpen =() =>{
    setContactsignpopup(true);
    setRefresh((refresh) => refresh +1 );
  }

  const MobileContactdownloadCallbackOpen =() =>{
    setDownloadpopup(true);
    setRefresh((refresh) => refresh +1 );
  }

  const MobilePayCallbackOpen =() =>{
    setPaypopup(true);
    setRefresh((refresh) => refresh +1 );
  }
  /**
   * 두단계 콜백을 거쳐서 오늘 콜백 닫기 위해 사용
   * ! MobileContactsingCallback / MobileContactdownloadCallback /  MobilePaypopupCallback
   */
  const MobileContactsignCallback = () =>{
    setContactsignpopup(false);
    setRefresh((refresh) => refresh +1 );
  }

  const MobilePaypopupCallback =()=>{
    setPaypopup(false);
    setRefresh((refresh) => refresh +1 );
  }
  
  const MobileContactdownloadCallback = () =>{
    setDownloadpopup(false);
    setRefresh((refresh) => refresh +1 );
  }

  const MobilePayCallback = () =>{
    setPaypopup(false);
    setRefresh((refresh) => refresh +1 );
  }



  const findPrice = () =>{
    const FindIndex = ITEM.WORK_INFO.WORK_INFO.findIndex(x=>x.requesttype == REQUESTINFO.MONEY);

    return ITEM.WORK_INFO.WORK_INFO[FindIndex].result;
  }

  const imguploadwarningcallback = () =>{
    setRegistimgfail(false);
    setRefresh((refresh) => refresh +1);
  }
  return (
    <Container style={containerStyle}>

      {
        registimgfail == true && <MobileWarningPopup callback={imguploadwarningcallback} content ={'업로드 대상 파일의 확장자는 bmp, jpg, jpeg, png 만 가능 합니다'} />
      }
      {
        contactpopup == true && <MobileContact 
        WORK_ID ={ITEM.WORK_INFO.WORK_ID}
        OWNER_ID={ITEM.OWNER_ID}
        SUPPORTER_ID ={ITEM.SUPPORTER_ID}
        CHAT_ID={ITEM.CHAT_ID}
        callback={MobileContactCallback} 
        btn1callback={MobileContactsignCallbackOpen}
        btn2callback={MobilePayCallbackOpen}
        btn3callback={MobileContactdownloadCallbackOpen}/>
      }

      {
        contactsignpopup == true && <MobileContactSign callback={MobileContactsignCallback} 
        messages={ITEM.WORK_INFO.WORK_INFO} 
        WORK_ID ={ITEM.WORK_INFO.WORK_ID}
        OWNER_ID={ITEM.OWNER_ID}
        SUPPORTER_ID ={ITEM.SUPPORTER_ID}
        OWNER ={OWNER}
        WORKTYPE={ITEM.WORKTYPE}/>
      }

      {
        paypopup == true && <MobilePayPopup />
      }

      {
        downloadpopup == true && <MobileContactDoc callback={MobileContactdownloadCallback} 
        messages={ITEM.WORK_INFO.WORK_INFO} 
        WORK_ID ={ITEM.WORK_INFO.WORK_ID}
        OWNER_ID={ITEM.OWNER_ID}
        SUPPORTER_ID ={ITEM.SUPPORTER_ID}
        OWNER ={OWNER}
        WORKTYPE={ITEM.WORKTYPE}/>
      }
      



      <Row margin={'0px auto;'} width={'100%'} height={'100%'} >
        <Column style={{background:"#fff", width:"100%", height:"100%", justifyContent:"flex-start", borderRight: "1px solid #ededed"}}>
          <Enter onClick={()=>{}}>
            <Row style={{paddingLeft:20}}>
              <img src={Seekimage(ITEM.WORK_INFO.WORKTYPE)} style={{width:"60px", height:"60px"}}/>
            </Row>
            <Row style={{width:"100%", justifyContent:"flex-start"}}>
            <div style={{display:"flex", flexDirection:"column", paddingLeft:"10px",lineHeight:1.9, width:"70%"}}>
              <div style={{display:"flex", flexDirection:"column",justifyContent:"flex-start"}}>
              <FlexstartRow>
              {
                OWNER == true ? (   <OwnerTag>의뢰</OwnerTag>):(   <SupportTag>지원</SupportTag>)
              }
              <StoreName>{ITEM.WORK_INFO.WORKTYPE}</StoreName>
              </FlexstartRow>

              <StoreAddr>{ITEM.OWNER.USERINFO.address_name} {parseInt(distanceFunc(user.latitude, user.longitude, user.latitude, user.longitude) /1000)}km</StoreAddr>
              </div>
          
              <StorePrice>가격 {findPrice()}</StorePrice>
            </div>
            <EnterButton>
                <Button
                text={"계약"}
                onPress={_handlecontact}
                containerStyle={{
                  color: "#fff",
                  background: "#A3A3A3",
                  width: "50px",
                  height: "25px",
                  fontSize: "14px",
                  marginLeft:"unset",
                  borderRadius:"5px",
                  border : "none",
                  fontFamily :"Pretendard"
                }}
                />
                     <Button
                text={"결제"}
                onPress={_handlecontact}
                containerStyle={{
                  color: "#fff",
                  background: "#A3A3A3",
                  width: "50px",
                  height: "25px",
                  fontSize: "14px",
                  marginLeft:"10px",
                  borderRadius:"5px",
                  border : "none",
                  fontFamily :"Pretendard"
                }}
                />

            </EnterButton>

            </Row>
        
          </Enter>
          <Content>
            <InfoBox>
              <div>{'홍여사 시스템에서는 건전한 체팅 문화를 이루기 위해 욕설이나 상대방 비방글을 사용 하는 경우 홍여사 신고센타를 운영하고 있습니다 많은 이용 바랍니다'}</div>
            </InfoBox>
          </Content>
          {
            currentloading == true ? (<LottieAnimation containerStyle={LoadingChat2AnimationStyle} animationData={imageDB.loading}
              width={"50px"} height={'50px'}/>) :(<ShowContainer>
              {messages.map((data, index) => (
                <>
            
                  {(data.CHAT_CONTENT_TYPE != CHATCONTENTTYPE.EXIT
                  && data.CHAT_CONTENT_TYPE != CHATCONTENTTYPE.ENTER) &&
                    <>
                      {user.users_id != data.USERS_ID ? (
                        <ItemLayerA>
                          <Row>
                            <ChatUserImg>
                              <img
                                src={LEFTIMAGE}
                                style={{
                                  width: 50,
                                  height: 45,
                                  borderRadius: 30,
                                }}
                              />
                            </ChatUserImg>
                            <FlexstartColumn>
                              <ItemLayerAname>
                                  {LEFTNAME}
                              </ItemLayerAname>

                              <ItemLayerAcontent>
                                {
                                  data.CHAT_CONTENT_TYPE == CHATCONTENTTYPE.IMAGE ? (<img src={data.TEXT}
                                    style={{width: '70%',
                                    height: '250px',
                                    padding: '10px',
                                    borderRadius: '20px'  
                                    }}
                                  />):( <ItemBoxA>{data.TEXT}</ItemBoxA>)
                                }
                              
                                <ItemLayerAdate>
                                  <div> {getDate(data.CREATEDAT)}</div>
                                  <div> {getTime(data.CREATEDAT)}</div>
                                </ItemLayerAdate>
                              </ItemLayerAcontent>
                            </FlexstartColumn>
                          </Row>
                        </ItemLayerA>
                      ) : (
                        <ItemLayerB>
                          <ItemLayerBBox>
                            {/* {
                              //read 사용자를 계산해서 보여주는 function를 만들자
                              ReadCount(data)> 0 &&
                              <ItemLayerBUnread>{ReadCount(data)}</ItemLayerBUnread>
                            }
                          */}
                            <ItemLayerBdate>
                              <div> {getDate(data.CREATEDAT)}</div>
                              <div> {getTime(data.CREATEDAT)}</div>
                             
                              </ItemLayerBdate>
                          </ItemLayerBBox>
                          {
                            data.CHAT_CONTENT_TYPE == CHATCONTENTTYPE.IMAGE  ? (<img src={data.TEXT}
                              style={{width: '70%',
                              height: '250px',
                              padding: '10px',
                              borderRadius: '20px'  
                              }}
                            />):( <ItemBoxB>{data.TEXT}</ItemBoxB>)
                          }
                        </ItemLayerB>
                      )
                      }
                    </>
                  }
            
                  
                </>
              ))}
          </ShowContainer>)
          }


        </Column>
        <BottomLine>         
            <ChatbtnLayer>
              <ChatIconLayer>
                <SlPaperClip size={20} color={"#000"} onClick={handleUploadClick} />
              </ChatIconLayer>

              <InputChat
              value={message}
              id="yourTextInputId" autofocus
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
              <Row>
                <Button
                  onPress={_handlesend}
                  text={"전송"}
                  containerStyle={{
                    backgroundColor: "#ffa719",
                    color: "#fff",
                    margin: "10px",
                    border:"none",
                    width: "60px",
                    borderRadius: 5,
                    height: "30px",
                  }}
                />
              </Row>
            </ChatbtnLayer>

            <input
              type="file"
              ref={fileInput}
              onChange={handlefileuploadChange}
              style={{ display: "none", color:"#999" }}
            />
        </BottomLine>
 
      </Row>

   


    </Container>
  );

}

export default MobileContentcontainer;

