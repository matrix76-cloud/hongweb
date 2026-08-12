import React, { Component, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekimage } from "../../utility/imageData";


import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { CHATCONTENTTYPE, CHATIMAGETYPE, CONTACTTYPE, EventItems, PCCOMMNUNITYMENU } from "../../utility/screen";


import { DataContext } from "../../context/Data";
import { sleep, useSleep } from "../../utility/common";

import { WORKNAME,REQUESTINFO } from "../../utility/work";

import { CommaFormatted } from "../../utility/money";

import {
  SlShield,
  SlPaperClip,
  SlLogout,
  SlUserUnfollow,
} from "react-icons/sl";
import { CreateDocMessageEx, CreateMessage, CreateMessageEx2, ReadDocChat } from "../../service/ChatService";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../api/config";
import { getDateFullTime, getTime, getDate } from "../../utility/date";
import LottieAnimation from "../../common/LottieAnimation";
import { LoadingChat2AnimationStyle, LoadingChatAnimationStyle } from "../../screen/css/common";
import { uploadImage, uploadPdf } from "../../service/UploadService";
import MobileWarningPopup from "../../modal/MobileWarningPopup/MobileWarningPopup";
import { setRef } from "@mui/material";

import MobilePayPopup from "../../modal/MobilePayPopup/MobilePayPopup";
import MobileWorkMapPopup from "../../modal/MobileMapPopup/MobileWorkMapPopup";
import MobileSignPopup from "../../modal/MobileSignPopup/MobileSignPopup";
import MobileSuccessPopup from "../../modal/MobileSuccessPopup/MobileSuccessPopup";

import { CreateContact, ReadContactByIndividually, UpdateContactByLeftSign, UpdateContactByPURCHASE, UpdateContactByRightSign, UpdateLicenseByContactID } from "../../service/ContactService";

import { Toaster, toast } from 'sonner';
import { useReactToPrint } from "react-to-print";
import ButtonEx from "../../common/ButtonEx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getFontSize } from "../../utility/fontsize";
import useContractFlow from "../../hooks/useContractFlow";



const Container = styled.div`
    background-color : #fff;
`

const ScrollArea = styled.div`
  height: calc(100vh - 60px); // 탭/헤더 등 여백 고려
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 150px; // ✅ 하단 여유 공간 확보!
`;

const style = {
  display: "flex"
};

const HeaderPopupline = styled.div`

  width:20%;
  background:#E3E3E3;
  height:4px;
`
const IconCloseView = styled.div`

`

const ContactMain = styled.div`
  display: flex;
  justify-content: center;
  font-size: ${() => getFontSize(22)}px !important;
  margin-bottom: 10px;
  font-family: 'Pretendard-SemiBold';
`

const ContactSubject = styled.div`
  display: flex;
  justify-content: center;
  font-size: ${() => getFontSize(22)}px !important;
  margin-bottom: 10px;
  font-family: 'Pretendard-SemiBold';

`

const ContactContent = styled.div`
  display: flex;
  justify-content: center;
  font-size: ${() => getFontSize(15)}px !important;
  margin-bottom: 10px;
  line-height:1.8;
`

const MainData = styled.div`
  display :flex;
  flex-direction:column;
  background-color : #fff;
  flex-wrap : wrap;
  margin: 0 auto;
  width:100%;
  margin-left:-5px;
`
const ResultContent = {
  width: '100%',
  height: '150px',
  marginTop: '10px',
  marginBottom:'10px',
  fontSize: '14px',
  fontFamily: 'Pretendard-Light',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border :'1px solid #ededed',
  borderRadius:'5px',
  backgroundColor:"#fff",
  marginLeft:10

}

const CommentComponent = styled.div`
  width: 100%;
  font-size: ${() => getFontSize(14)}px !important;
  font-family: Pretendard-Light;
  background-color: rgb(255, 255, 255);
 
`

const InputComponent = styled.input`

width: 100%;
padding: 10px;
font-size: ${() => getFontSize(16)}px !important;

border-radius: 8px;
box-sizing: border-box;

  border :${({adjust}) => adjust == false ? (''):('1px solid #ccc')};
  border-bottom: ${({adjust}) => adjust == false ? ('1px solid rgb(218, 218, 218)'):('')};
  border-left :${({adjust}) => adjust == false ? ('none'):('')};
 
`

const SignLine = styled.div`
  width: 100%;
  height: 150px;
  border: 1px solid #dfdfdf;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size: ${() => getFontSize(10)}px !important;
  font-style: italic;
  background :#e8e5e5;
`
const SignItem = styled.div`
background: #4a4848;
color: #fff;
width: 102%;
display: flex;
justify-content: center;
height:50px;
align-items:center;
flex-direction:column;



`
const ShowContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 50px 30px 100px;
  width:100%;
  border : 1px solid #ededed;


  margin-bottom: 100px; // ✅ 하단 공간 확보


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
  font-size: ${() => getFontSize(12)}px !important;
`;
const ItemLayerAname = styled.div`
  justify-content: flex-start;
  font-size: ${() => getFontSize(12)}px !important;
  flex-direction: row;
  display: flex;
  padding-right: 10px;
`;
const ItemLayerAcontent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;
const ItemLayerAdate = styled.div`
  font-size: ${() => getFontSize(10)}px !important;
  width: 100px;
  display: flex;
  justify-content: flex-start;
  padding-bottom:10px;
  color:#A3A3A3;
  flex-direction:column;
`;

const DateText = styled.div`
  font-size: ${() => getFontSize(10)}px !important;
`


const ItemLayerB = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
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
  font-size: ${() => getFontSize(14)}px !important;
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
  font-size: ${() => getFontSize(14)}px !important;
  text-align: left;
`;


const ItemLayerBdate = styled.div`
  font-size: ${() => getFontSize(10)}px !important;
  display: flex;
  justify-content: flex-end;
  color:#A3A3A3;
  flex-direction:column;
  padding-bottom: 8px; // 기존보다 여유롭게
  
`;
const ItemLayerBUnread = styled.div`
  font-size: ${() => getFontSize(10)}px !important;
  display: flex;
  justify-content: flex-end;
  padding-bottom: 2px;
  color:#A3A3A3;
  flex-direction:column;

`
const LineLayer = styled.div`
  display:flex;
  flexDirection:row;
  justifyContent:flex-start;
  alignItems:center;
  width:100%;
  border : ${({check}) => check == false ? ("2px solid #ff7e19") : ('')};
  padding : ${({check}) => check == false ? ("10px") : ('')};
`

const StepBox = styled.div`
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;
  margin-top:10px;
  width: 95%;
}

`

const SignatureStatus = styled.div`

font-size: ${() => getFontSize(14)}px !important;
color: #4caf50;
margin-top: 6px;
text-align: right;

`

const float = keyframes`
  0% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-3px); }
  100% { transform: translateX(-50%) translateY(0); }
`;

const StepTooltip = styled.div`
  position: absolute;
  top: -38px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff5e6; /* 밝은 살구색 배경 */
  color: #ff7e19;       /* 브랜드 오렌지 */
  font-size: ${() => getFontSize(13)}px !important;
  font-family: 'Pretendard-SemiBold';
  padding: 6px 12px;
  border-radius: 6px;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  animation: ${float} 2s ease-in-out infinite;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -6px;
    border-width: 6px;
    border-style: solid;
    border-color: #fff5e6 transparent transparent transparent;
  }
`;

const ImportantBox = styled.div`
  background-color: #fff8e1;
  color: #ff7e19;

  padding: 12px;
  border-left: 5px solid #ffb74d;
  border-radius: 8px;
  margin-bottom: 20px;
  font-family: Pretendard-SemiBold;
  line-height: 1.6;
  display:flex;
  flex-direction:row;
`;

const ImportantBoxText = styled.div`

  font-size: ${() => getFontSize(14)}px !important;
`

const ScrollBottomAnchor = styled.div`
  height: 1px;
  scroll-margin-top: 60px; // ✅ 요게 핵심!
`;

const MobileContract = ({
  containerStyle,
  WORKTYPE,
  CHAT_ID,
  ID,
  OWNER_ID,
  SUPPORTER_ID,
  NAME,
  LEFTNAME,
  RIGHTNAME,
  CONTACTITEM
}) => {

  const [messageitems, setMessageitems] = useState(CONTACTITEM.CONTACT_INFO || []);
  const { user } = useContext(UserContext);
  const { datadispatch } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [popupstatus, setPopupstatus] = useState(false);
  const [signstatus, setSignstatus] = useState(false);
  const [signsuccess, setSignsuccess] = useState(false);
  const [signfail, setFailsuccess] = useState(false);

  const [latitude, setLatitude] = useState("");
  const [longitudie, setLongitude] = useState("");
  const [worktype, setWorktype] = useState(WORKTYPE);

  const [leftname, setLeftname] = useState(LEFTNAME);
  const [rightname, setRightname] = useState(RIGHTNAME);
  const [leftsign, setLeftsign] = useState("");
  const [rightsign, setRightsign] = useState("");
  const [OWNER, setOWNER] = useState(false);

  const [chatitems, setChatitems] = useState([]);
  const componentRef = useRef();

  useEffect(() => {
    if (!CONTACTITEM) return;
    setLeftsign(CONTACTITEM.LEFT_SIGN || "");
    setRightsign(CONTACTITEM.RIGHT_SIGN || "");
  }, [CONTACTITEM]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function FetchData() {
      if (user.USERS_ID === OWNER_ID) {
        setOWNER(true);
        setLeftname(LEFTNAME);
        setRightname(user.USERINFO.nickname);
      } else {
        setOWNER(false);
        setLeftname(user.USERINFO.nickname);
        setRightname(RIGHTNAME);
      }

      const chatitems = await ReadDocChat({ DOC: CHAT_ID });
      setChatitems(chatitems);
    }
    FetchData();
  }, []);

  const handleDownloadPdf = async (CONTACT_ID) => {
    const element = componentRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageHeight = 297, margin = 10;
    const imgWidth = 210 - margin * 2;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight, position = 0;

    pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const pdfBlob = pdf.output("blob");
    const url = await uploadPdf({ uri: pdfBlob, random: Math.random() });
    await UpdateLicenseByContactID({ CONTACT_ID, URL: url });
  };

  const _handlerightSign = () => {
    const moneyInfo = messageitems.find(x => x.requesttype === '금액');
    if (!OWNER || rightsign || isNaN(Number(moneyInfo?.result))) {
      toast.error("금액을 입력하고 서명해주세요");
      return;
    }
    setSignstatus(true);
  };

  const _handleleftSign = () => {
    if (OWNER || leftsign) return;
    if (!rightsign) {
      toast.error("의뢰자가 먼저 서명해야 합니다");
      return;
    }
    setSignstatus(true);
  };

  const signcallback = async (data) => {
    if (!data) return setSignstatus(false);
    setSignstatus(false);
    setSignsuccess(true);
    const CONTACT_ID = CONTACTITEM.CONTACT_ID;

    if (!OWNER) {
      setLeftsign(data);
      await UpdateContactByLeftSign({ CONTACT_ID, LEFT_SIGN: data });
      handleDownloadPdf(CONTACT_ID);
      await sleep(100);
      await CreateDocMessageEx({
        CHAT_ID, msgitems: [
          `${user.USERINFO.nickname}님이 계약서에 서명 진행 하였습니다`,
          "결제 버튼을 클릭하여 계약을 완료하세요"
        ], users_id: user.USERS_ID, read: [user.USERS_ID], CHAT_CONTENT_TYPE: CHATCONTENTTYPE.LEFTSIGN, OWNER_ID, SUPPORTER_ID
      });
    } else {
      setRightsign(data);
      await UpdateContactByRightSign({ CONTACT_ID, RIGHT_SIGN: data, CONTACT_INFO: messageitems });
      await sleep(100);
      await CreateDocMessageEx({
        CHAT_ID, msgitems: [
          `${user.USERINFO.nickname}님이 계약서에 서명 진행 하였습니다.`,
          `${leftname}이 계약서에 서명할 차례입니다.`,
          `상단의 계약버튼을 클릭 > 서명 하시기 바랍니다.`
        ], users_id: user.USERS_ID, read: [user.USERS_ID], CHAT_CONTENT_TYPE: CHATCONTENTTYPE.RIGHTSIGN, OWNER_ID, SUPPORTER_ID
      });
    }
  };

  const signsuccesscallback = () => {
    setSignsuccess(false);
  }


  return (
    <Container style={containerStyle} >

        {
          popupstatus == true && <MobileWorkMapPopup callback={popupcallback} latitude={latitude} longitude={longitudie}
          top={'30%'}  left={'10%'} height={'280px'} width={'280px'} name={worktype} markerimg={Seekimage(worktype)}
          />
        }

        {
          signstatus == true && <MobileSignPopup callback={signcallback} 
          top={'30%'}  left={'10%'} height={'130px'} width={'280px'} 
          />
        }

        {
          signsuccess == true && <MobileSuccessPopup callback={signsuccesscallback} content={'정상적으로 서명되었습니다'} />
        }

 

        <ScrollArea style={{ width: "85%", margin: "0px auto" }} ref={componentRef}>
        <ContactMain>용역 계약서</ContactMain> 

        <ImportantBox>
          <img src={imageDB.doc} style={{ width: 40, height:40 }} />
          <ImportantBoxText>
            본 계약서에는 계약 체결 전 <b>실제 채팅 내용</b>이 함께 첨부되어
            분쟁 발생 시 <b>법적 참고 자료</b>로 활용됩니다.
          </ImportantBoxText>
       
        </ImportantBox>

        <ContactContent>
          본 계약서(이하 "계약서")는 [계약 체결일]에 [용역 수요자] (이하 "수요자")와 [용역 제공자] (이하 "제공자") 간에 체결되었습니다.
        </ContactContent>
        <ContactContent>
          1. 계약 목적
          본 계약은 제공자가 수요자에게 다음의 용역을 제공함에 있어 필요한 사항을 규정함을 목적으로 합니다.
            - [용역 내용 아래의 표에 기재]
        </ContactContent>
        <ContactContent>
          2. 용역 수행 및 기간
          제공자는 [요청일자]에 본 계약에 명시된 용역을 성실히 수행해야 합니다.
        </ContactContent>
        <ContactContent>
          3. 비밀 유지
          제공자는 용역 수행 중 수요자로부터 제공받은 모든 기밀 정보를 계약 종료 후에도 비밀로 유지해야 합니다.
        </ContactContent>

        <ContactContent>
        4. 근거 내용
          계약과 관련된 내용으로 일꾼과 의뢰자 사이에 의견교환 된 체팅 내용는 참고 내용으로 근거한다.
        </ContactContent>

        <ContactContent>
        5. 분쟁 해결
          계약과 관련된 모든 분쟁은 [관할 법원]에서 해결합니다.
          본 계약의 효력을 확정하기 위해, 당사자 양측은 아래에 서명합니다.
        </ContactContent>

        <MainData>
    
            <StepBox>1️⃣ 계약 내용을 꼼꼼히 확인해주세요.</StepBox>
            {
              CONTACTITEM.CONTACT_INFO.map((data, index)=>(
                <>
                {
                (data.type =='response' && data.requesttype !='고객님성별'
                && data.requesttype !='요청성별'
                && data.requesttype != REQUESTINFO.MONEY
                && data.requesttype !='요청연령대')
                &&
                <FlexstartRow>
                <div  style={{width:"100px", fontSize: () => getFontSize(14), paddingLeft:5}}>{data.requesttype}</div>
              
                <LineLayer check={true}>
                {
                  (data.requesttype != REQUESTINFO.MONEY)  && (
                  <CommentComponent>{data.result}</CommentComponent>)
                }  

                </LineLayer>
              
              
                </FlexstartRow>
                
                }
                </>                  
              ))
            }
        
            <StepBox>2️⃣ 의뢰자는 금액을 입력하고 서명해주세요.</StepBox>
          
            {messageitems.map((data, index) => (
              <>
                {data.type === 'response' && data.requesttype === REQUESTINFO.MONEY && (
                  <FlexstartRow style={{ marginTop: 10 }}>
                    <div style={{ width: "100px", fontSize: getFontSize(14), paddingLeft: 5 }}>
                      {data.requesttype}
                    </div>

                    <LineLayer check={true}>
                      {OWNER === false && rightsign === '' ? (
                        <div style={{ fontSize: getFontSize(14) }}>
                          금액은 의뢰자가 입력 후 서명하면 자동으로 표시됩니다.
                        </div>
                      ) : (
                        <>
                          {OWNER === false ? (
                            <div style={{ fontSize: getFontSize(14) }}>
                              {CommaFormatted(data.result)}원
                            </div>
                          ) : (
                            <div style={{ position: 'relative' }}>
                              <StepTooltip>① 금액 입력 후 서명해주세요</StepTooltip>
                              <InputComponent
                                adjust={OWNER === true && leftsign === ''}
                                type="number"
                                value={typeof data.result === "number" && !isNaN(data.result) ? data.result : ""}
                                disabled={OWNER === false || leftsign !== ''}
                                onChange={(e) => {
                                  const cleaned = e.target.value.replace(/^0+/, ''); // 앞 0 제거
                                  const updated = [...messageitems];
                                  updated[index] = {
                                    ...updated[index],
                                    result: Number(cleaned)
                                  };
                                  setMessageitems(updated);
                                }}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </LineLayer>
                  </FlexstartRow>
                )}
              </>
            ))}


             <StepBox>3️⃣ 도움주실 분도 서명하여 계약을 완료해주세요.</StepBox>

   

          <BetweenRow style={{ width: "100%", gap: "4%" }}>
            <Column style={{width:"48%", margin:"20px auto", marginRight:'5px'}}>
            <SignItem>
              <div>도움줄분 서명</div>
            </SignItem>
            <SignLine>
              {
                leftsign == '' ?( <div onClick={_handleleftSign}>
                  {
                  (OWNER == false && rightsign == '') && <span style={{fontSize: () => getFontSize(12)}}>의뢰자 서명이 완료되면 서명할 수 있습니다.</span>
                  }   
                  {
                      (OWNER == false && rightsign != '') &&

                      <div style={{ position: 'relative' }}>
                
                          <StepTooltip>① 도움주실분 서명 단계입니다</StepTooltip>
                           <span style={{ fontSize: () => getFontSize(12) }}>여기에 손가락 또는 스타일러스로 서명해주세요. (의뢰자 서명 완료됨)</span>
        
                       </div>
                    
                  }  
                  </div>):(
                      <Column style={{ justifyContent: "space-around" }} onClick={_handleleftSign}>
                        <SignatureStatus>✔ 도움줄분 서명 완료</SignatureStatus>
                        <img src={leftsign} style={{ width: '100%' }}/>
                      </Column>
                )
              }
              
            </SignLine>
            </Column>
            <Column style={{ width: "48%", margin: "20px auto" }}>
              <div style={{ position: 'relative' }}>
                {
                  rightsign == '' && <StepTooltip>② 의뢰자 서명 단계입니다</StepTooltip>
                }
        
              </div>
         
            <SignItem>
              <div>의뢰자 서명</div>
            </SignItem>
            <SignLine>
            {
                rightsign == '' ?( <div onClick={_handlerightSign}>

                {
                    OWNER == true && <span style={{fontSize: () => getFontSize(12), padding:5}}>{'여기에 손가락 또는 \r 스타일러스로 서명해주세요.'}</span>
                }

                </div>):(
                  <Column style={{justifyContent:"space-around"}} onClick={_handlerightSign}>
                    <SignatureStatus>✔ 의뢰자 서명 완료</SignatureStatus>
                    <img src={rightsign} style={{width:'100%'}}/>
                  </Column>
                )
              }
            </SignLine>
            </Column>

         
          </BetweenRow>

          <Row style={{marginBottom:40, fontSize: () => getFontSize(20), width:"100%"}}>
            계약 체결일 : {getDate(moment())}
          </Row>

          <div style={{ background:"#fff",width:"100%"}}>
            <ContactSubject>용역 계약서 첨부자료</ContactSubject> 
             <ShowContainer style={{padding:5}}>
              {chatitems.map((data, index) => (
                <>
      
                  {(data.CHAT_CONTENT_TYPE != CHATCONTENTTYPE.RIGHTSIGN
                    && data.CHAT_CONTENT_TYPE != CHATCONTENTTYPE.LEFTSIGN
                    && data.CHAT_CONTENT_TYPE != CHATCONTENTTYPE.ENTER) &&
                    <>
                      {user.USERS_ID != data.USERS_ID ? (
                        <ItemLayerA>
                          <Row>
             
                            <FlexstartColumn>
                              <ItemLayerAname>
                                  {leftname}
                              </ItemLayerAname>

                              <ItemLayerAcontent>
                                {
                                  data.CHAT_CONTENT_TYPE == CHATCONTENTTYPE.IMAGE2 ? (<img src={data.TEXT}
                                    style={{width: '70%',
                                    height: '250px',
                                    padding: '10px',
                                    borderRadius: '20px'  
                                    }}
                                  />):( <ItemBoxA>{data.TEXT}</ItemBoxA>)
                                }
                              
                                <ItemLayerAdate>
                                <DateText> {getDate(data.CREATEDT)}</DateText>
                                <DateText> {getTime(data.CREATEDT)}</DateText>
                                </ItemLayerAdate>
                              </ItemLayerAcontent>
                            </FlexstartColumn>
                          </Row>
                        </ItemLayerA>
                          ) : (
                        <Column style={{width:"100%", alignItems:"flex-end"}}>
                            <ItemLayerAname>
                                {rightname}
                            </ItemLayerAname> 
                            <ItemLayerB>

                                <ItemLayerBBox style={{ width: "10%", justifyContent: "space-between", flexDirection: "row", marginRight:30 }}>
                                    <ItemLayerBdate>
                                <DateText> {getDate(data.CREATEDT)}</DateText>
                                <DateText> {getTime(data.CREATEDT)}</DateText>
                                    </ItemLayerBdate>
                                </ItemLayerBBox>
                                {
                                    data.CHAT_CONTENT_TYPE == CHATCONTENTTYPE.IMAGE2 ? (<img src={data.TEXT}
                                        style={{
                                            height: '250px',
                                            padding: '10px',
                                            borderRadius: '20px'
                                        }}
                                    />) : (<ItemBoxB>{data.TEXT}

                                    </ItemBoxB>)
                                }

                            </ItemLayerB>
                        </Column>       
                  
                      )
                      }
                    
                    </>
                  }
            
                  
                </>
              ))}

         
            </ShowContainer>
          </div>
        </MainData>

        <ScrollBottomAnchor style={{ height: "1px" }} />

    
        </ScrollArea>




      
      <Toaster position="bottom-right" richColors />

    </Container>
  );

}

export default MobileContract;

