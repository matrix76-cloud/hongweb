import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import ButtonEx from "../../../common/ButtonEx";
import { BetweenColumn, Column, FlexstartColumn } from "../../../common/Column";
import { AroundRow, BetweenRow, FlexEndRow, FlexstartRow, Row } from "../../../common/Row";
import Text from "../../../common/Text";
import { UserContext } from "../../../context/User";
import { CONFIGMOVE, EventItems, ReviewContent } from "../../../utility/screen";
import { SubKeywordAddress } from "../../../utility/region";

import "../../../screen/css/common.css";
import { FaTemperatureHigh } from "react-icons/fa";

import { GrTransaction } from "react-icons/gr";
import { FaRegHeart } from "react-icons/fa";
import { DiResponsive } from "react-icons/di";
import { TbRelationOneToOne } from "react-icons/tb";
import { RiArrowRightSLine } from "react-icons/ri";
import { uploadImage } from "../../../service/UploadService";
import { Readuserbyusersid, Update_userinfobyusersid } from "../../../service/UserService";
import { FaCamera } from "react-icons/fa";
import { PiLockKeyLight } from "react-icons/pi"
import { BADGE } from "../../../utility/badge";
import { imageDB } from "../../../utility/imageData";
import { UpdateWorkInfoImageAll } from "../../../service/WorkService";
import { UpdateRoomInfoImageAll } from "../../../service/RoomService";
import LottieAnimation from "../../../common/LottieAnimation";
import { LoadingChatAnimationStyle, LoadingProfileAnimationStyle } from "../../../screen/css/common";
import { ReadChatReview } from "../../../service/ChatService";
import { GoRows } from "react-icons/go";
import TimeAgo from 'react-timeago';
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { getDate, getDateFullTime, getFullTime } from "../../../utility/date";
import ReviewItem from "../../ReviewItem";

import { PiBroom } from "react-icons/pi";

import { FaPen } from "react-icons/fa6";
import { GoPencil } from "react-icons/go";
import { TbGpsFilled } from "react-icons/tb";
import { TbGps } from "react-icons/tb";
import { MdOutlineChangeCircle } from "react-icons/md";
import Empty from "../Empty";
import { IoCloseOutline } from "react-icons/io5";
import { getFontSize } from "../../../utility/fontsize";

const formatter = buildFormatter(koreanStrings); 

const Container = styled.div`
  background-color : #fff;
  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh - 50px);
  touch-action: pan-y;
`
const style = {
  display: "flex"
};

const BoxItem = styled.div`
  background: #fff;
  display: flex;
  flex-direction : column;
  margin: 0px auto 7px;
  padding: 30px;
  font-size: ${() => getFontSize(14)}px;
`

const BoxImg2 = styled.div`
  border-radius: 50px;
  background: ${({enable}) => enable == true ? ('#fdeda8'):('#ededed')};
  padding: 30px;
  display :flex;
`

const Name = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(18)}px;
  width:50%;
`
const Link = styled.div`

  font-size: ${() => getFontSize(16)}px;
  padding-left: 5px;
  margin-right :5px;

`

const RealName = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(20)}px;
  padding-left:10px;
`
const TemperatureLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: ${() => getFontSize(14)}px;
  color: #131313;
  font-family: 'Pretendard-SemiBold';
`
const PointBox = styled.div`

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin : 10px 0px;
  flex-direction : row;
  padding: 15px 10px;

`
const PointBoxInner = styled.div`

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: ${() => getFontSize(14)}px;
  margin-top: 5px;
 

`
const SubLabel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding-left: 10px;
`
const SubLabelContent = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(16)}px;
  padding: 20px 0px;
`
const Point = styled.div`
  color: #ff4e19;
  padding: 10px 18px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${() => getFontSize(18)}px;
  font-family: 'Jalnan2';
  border: 2px dotted #ff4e19;

`
const ULITEM = styled.div`
  line-height: 2.5;
  margin-top: 10px;
  font-size :16px;
  color :#131313;
`
const Box = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction:column;
  border-radius: 15px;
  height:110px;
  font-size: ${() => getFontSize(15)}px;
  width:33%;


`
const BoxImg = styled.div`
  border-radius: 50px;
  background: ${({enable}) => enable == true ? ('#fdeda8'):('#ededed')};
  padding: 20px;
  display :flex;
`

const Poupup = styled.div`
  position: fixed;
  bottom: 0px;
  width: 100%;
  background: #f8c81a;
  color :#131313;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;


`

const NameTag = styled.div`
  background: #fff;
  color: #131313;
  font-size: ${() => getFontSize(10)}px;
`

const Label = styled.div`
  font-size :18px;
  font-family : Pretendard-SemiBold;
`

const ResultContent = {
  height: '150px',
  paddingTop: '20px',
  fontSize: '16px',
  outline:"none",
  resize :"none",
  border:"none",
  fontFamily: 'Pretendard-Regular',
  color: '#131313',
  lineHeight: 1.7
}
const SupportTag = styled.div`
  width: 30px;
  background: #ffffff91;
  font-size: ${() => getFontSize(10)}px;
  color: #ff7e19;
  font-family: 'Pretendard-Bold';
  border: 1px solid #ff7e19;
  border-radius: 5px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ContactTag = styled.div`
  width: 30px;
  font-size: ${() => getFontSize(10)}px;
  color: #1960ff;
  font-family: 'Pretendard-Bold';
  border: 1px solid #1960ff;
  border-radius: 5px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const CompleteTag = styled.div`
  width: 30px;
  font-size: ${() => getFontSize(10)}px;
  color: #1990ff;
  font-family: 'Pretendard-Bold';
  border: 1px solid #1990ff;
  border-radius: 5px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`


const BadgeItems=[
  {name : BADGE.WORKER1, img:"", enable:false,desc : BADGE.WORKERDESC1},
  { name: BADGE.WORKER2, img: "", enable: true,desc : BADGE.WORKERDESC2},
  {name : BADGE.WORKER3, img:"", enable:false,desc : BADGE.WORKERDESC3},
  {name : BADGE.WORKER4, img:"", enable:false,desc : BADGE.WORKERDESC4},
  {name : BADGE.WORKER5, img:"", enable:true,desc : BADGE.WORKERDESC5},
  {name : BADGE.WORKER6, img:"", enable:false,desc : BADGE.WORKERDESC6},
  {name : BADGE.WORKER7, img:"", enable:false,desc : BADGE.WORKERDESC7},
  {name : BADGE.WORKER8, img:"", enable:false,desc : BADGE.WORKERDESC8},
  {name : BADGE.WORKER9, img:"", enable:false,desc : BADGE.WORKERDESC9},
  { name: BADGE.WORKER10, img: "", enable: true,desc : BADGE.WORKERDESC10},
  {name : BADGE.WORKER11, img:"", enable:false,desc : BADGE.WORKERDESC11},
  {name: BADGE.WORKER12, img: "", enable: false, desc: BADGE.WORKERDESC12 },
  {name: BADGE.WORKER13, img: "", enable: false, desc: BADGE.WORKERDESC13 },
  {name: BADGE.WORKER14, img: "", enable: false, desc: BADGE.WORKERDESC14 },
  { name: BADGE.WORKER15, img: "", enable: false, desc: BADGE.WORKERDESC15 },
  { name: BADGE.WORKER16, img: "", enable: false, desc: BADGE.WORKERDESC16 },
  { name: BADGE.WORKER17, img: "", enable: false, desc: BADGE.WORKERDESC17 },
  { name: BADGE.WORKER18, img: "", enable: false, desc: BADGE.WORKERDESC18 },

]

const Tag = styled.div`
  padding: 0px 10px;
  background: #ff7e19;
  color: #fff;
  font-size: ${() => getFontSize(10)}px;
  margin-left:10px;

`
const DisableTag = styled.div`

  padding: 0px 10px;
  background: #EDEDED;
  color: #131313;
  font-size: ${() => getFontSize(10)}px;
  margin-left:10px;

`


const MainDataItem = styled.div`
  marginTop:20px;
  padding :5px;
  justify-content : flex-start;
  align-items :flex-start;
  border-radius :5px;
  background-color :  #fff;

  margin-bottom: 5px;
  border  :1px solid #ff7e19;
`
const MainDataItemText = styled.span`
  font-size :12px;
  color :  #ff7e19;
`

const Camera = styled.div`
  position: relative;
  top: 20px;
  left: -40px;
  background: #efefef9e;
  padding: 5px;
  border-radius: 50px;


`
const ActivityColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 20px;
  line-height: 2.5;
`

const Activity = styled.div`
  background: #fff;
  margin-bottom: 5px;
  display:flex;
  justify-content:center;
  align-items : flex-start;
  color :#131313;
  flex-direction: column;
  width :100%;
  border: 1px solid #ededed;
  border-radius:10px;


`
const Line = styled.div`
  height:2px;
  background:#ededed;
  width: 100%;
`

const ConfigBtn = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    border: 1px solid #ff7e19;
    border-radius: 999px;
    padding: 5px 10px;
    color: #ff7e19;
    font-size: ${() => getFontSize(14)}px;

`
const NoLayout = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;

    width : 10%;

`
const CloseButton = styled.div`
  position: absolute;
  top: 35px;
  right: 15px;
  padding: 8px 18px;
  background: #ff7e19;       // 강조 컬러 (브랜드 감성 유지)
  color: #fff;
  font-size: ${() => getFontSize(14)}px;
  font-weight: bold;
  border-radius: 999px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  cursor: pointer;
  z-index: 9999;
  display:flex;
  flex-direction:row;
`;


const MobileProfileConfig =({containerStyle, USERS_ID, editable, callback}) =>  {

/** 제목 정리
 ** 설명
 *! 중요한 내용
 * TODO 미진한 부분
 * ? 뤄리 API 설명
 * @param 파라미터 설명
 */

 const fileInput = useRef();


  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(1);
  const [temperature, setTemperature] = useState(40);
  const [img, setImg] = useState('');

  const [loading, setLoading] = useState(false);
  const [currentloading, setCurrentloading] = useState(true);
  const [index, setIndex] = useState('');
  const [useritem, setUseritem] = useState({});
  const [badge, setBadge] = useState(false);
  const [reviewitems, setReviewitems] = useState([]);
  const [reviewcontentitems, setReviewcontentitems] = useState([]);
  const [manneritems, setManneritems] = useState([]);
  const [badgedata, setBadgedata] = useState({});

  const [showImageChoice, setShowImageChoice] = useState(false);

  

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setTemperature(temperature);
    setCurrentloading(currentloading);
    setLoading(loading);
    setImg(img);
    setIndex(index);
    setUseritem(useritem);
    setReviewitems(reviewitems);
    setManneritems(manneritems);
    setBadgedata(badgedata);
    setReviewcontentitems(reviewcontentitems);
  }, [refresh])

  useEffect(()=>{
      async function FetchData(){

     
        const useritem = await Readuserbyusersid({ USERS_ID });
        

        console.log("useritem", useritem);

        let number = String(useritem.CREATEDT);
        
        setIndex(number.slice(5,number.length));
        setUseritem(useritem);

        const chatitems = await ReadChatReview({USERS_ID});

       

        let reviewdata = [];
        let reviewcontentdata = [];
        chatitems.map((chatdata)=>{

          if(chatdata.REVIEWITEMS != undefined 
            && chatdata.REVIEWITEMS.RESULTITEMS != undefined){
            chatdata.REVIEWITEMS.RESULTITEMS.map((data)=>{

              reviewdata.push({userimg :chatdata.OWNER.USERINFO.userimg, 
                username:chatdata.OWNER.USERINFO.nickname, 
                address_name : chatdata.OWNER.USERINFO.address_name, 
                reviewdate: chatdata.REVIEWITEMS.CREATEDT, 
                reviewtext:data.result});

              data.items.map((subdata)=>{
                if(subdata.count > 0){
                  const FindIndex = reviewcontentdata.findIndex(x=>x.content == subdata.content);

                  if(FindIndex == -1){
                    reviewcontentdata.push({content: subdata.content, count :1});
                  }else{
                    reviewcontentdata[FindIndex].count += 1;
                  }
        
                }
              })
              setReviewcontentitems(reviewcontentdata);
            })


          }
    
        })

        setReviewitems(reviewdata);

        setImg(user.USERINFO.userimg);
        setCurrentloading(false);
        setRefresh((refesh) => refresh +1);
      }
      FetchData();
  }, [])

  const handleUploadClick = (e) => {
    fileInput.current.click();
  };

  const ImageUpload = async (data, data2) => {
    const uri = data;
    const random = data2;
    const URL = await uploadImage({ uri, random });
    return URL;
  };

    
  const handlefileuploadChange = async (e) => {
    let filename = "";
    setLoading(true);
    setRefresh((refresh) => refresh +1);
    const file = e.target.files[0];
    filename = file.name;

    var p1 = new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;


        img.onload = function() {
          // 원본 이미지 크기
          const originalWidth = img.width;
     
       
          const originalHeight = img.height;
   
  
          // 원하는 이미지 크기 (예: 300x300으로 크기 조정)
          const targetWidth = 100;
          const targetHeight = 100;
  
          // Canvas 생성
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // 비율 유지를 위해 축소
          let width = originalWidth;
          let height = originalHeight;
          if (width > height) {
              if (width > targetWidth) {
                  height *= targetWidth / width;
                  width = targetWidth;
              }
          } else {
              if (height > targetHeight) {
                  width *= targetHeight / height;
                  height = targetHeight;
              }
          }
  
          // 리사이즈된 캔버스 크기 설정
          canvas.width = width;
          canvas.height = height;
  
          // 이미지 리사이즈하여 캔버스에 그리기
          ctx.drawImage(img, 0, 0, width, height);

  
          // 캔버스 데이터를 Blob으로 변환 (JPEG 포맷, 품질 0.8)
          // Canvas 데이터를 base64로 변환
          const base64Image = canvas.toDataURL('image/jpeg', 0.8);  // 품질 0.8로 JPEG 변환

          resolve(base64Image);

          
        }


      };
    });
    const getRandom = () => Math.random();
    const email = getRandom();

    p1.then(async (result) => {
      const uri = result;

      let url = await ImageUpload(uri, email);

      const IMGTYPE = true;


      setImg(url);


      dispatch({
        USERINFO: {
          userimg: url,
        },
      });


      const USERINFO = user.USERINFO;
      const USERS_ID = user.USERS_ID;


      const USERIMG = url;
      // 모든 체팅 업데이트 
      
      // 모든 일감 업데이트
      await UpdateWorkInfoImageAll({USERS_ID, USERIMG });
      // 모든 장소대여 업데이트
      await UpdateRoomInfoImageAll({USERS_ID, USERIMG });

      await Update_userinfobyusersid({USERINFO, USERS_ID});
   


      setLoading(false);
      setRefresh((refresh) => refresh +1);



    });
  };

  

  const _handleNameMove = () =>{
    navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.PROFILENAME, TYPE : ""}});
  }


  
  const _handleBadge= (data) =>{
    setBadge(true);
    setBadgedata(data);

    setRefresh((refresh) => refresh +1);
  }

  const _handleClose = (data) =>{
    setBadge(false);

    setRefresh((refresh) => refresh +1);
  }

  const _handleAdjust = () =>{
    navigate("/Mobileladyresume",{state :{REALNAME :user.realname}});
  } 

 
  return (

    <Container style={containerStyle}>
      {!editable && (
        <>
            <CloseButton onClick={callback}>
            <IoCloseOutline size={30} style={{ marginRight: 6 }} />
            <div>닫기</div>
          </CloseButton>  
        </>

    )}

    {badge == true ? (
            <Poupup>
              <Column>

                <Column style={{margin:"20px 0px 20px"}}>
                  <BoxImg2 enable={true}>
                  <img src={imageDB.medal} style={{width:45, height:45}}/>
                  </BoxImg2>
                </Column>

                <Column>
                <div style={{fontFamily:'Pretendard-Bold', fontSize: () => getFontSize(20)}}>
                  {badgedata.name}
                </div>
                
                </Column>

                <Column style={{marginTop:10}}>
                  <div style={{fontFamily:'Pretendard-Light'}}>뱃지를 획득하는 방법 : </div>
                  <div style={{fontFamily:'Pretendard-Light'}}>{badgedata.desc}</div>
                </Column>



                <div style={{margin:"20px auto", width:"100%"}}>
                  <ButtonEx text={'닫기'} width={'75'}  
                  onPress={_handleClose} bgcolor={'#f3f3f3'} color={'#131313'} containerStyle={{fontFamily:"Pretendard-Regular"
                  ,boxShadow:"none"}} />
                </div>
  
              
              </Column>
          

          
            </Poupup>
    ) : null}

    {
        currentloading == true  ? (<></>)
        :(<div>
          <BoxItem style={{padding:"10px 30px"}}>

              <Column style={{justifyContent:"space-between"}}>
              <Row style={{justifyContent:"flex-start", width:"100%"}}>
                  <img src={img}
                    loading="eager"  style={{ width: "45px", borderRadius: "45px", height: "45px", objectFit: "cover" }} />
                  <Camera onClick={handleUploadClick}>

                    {
                      editable != false && 
                      <FaCamera size="18px" />
                    }
                    
                  </Camera>
                  <input
                    type="file"
                    ref={fileInput}
                    onChange={handlefileuploadChange}
                    style={{ display: "none" }}
                  />

              

                <Column style={{width:"100%"}}>
                  <FlexstartColumn style={{width:"100%"}}>
                    <BetweenRow style={{width:"100%"}}>
                        <Name>{user.USERINFO.nickname}</Name>
                        <Row>
               
                          {
                            editable != false ? (<ConfigBtn>
                              <div onClick={_handleNameMove} >닉네임설정</div>
                            </ConfigBtn>) : (<NoLayout></NoLayout>)
                          }

                   

                        </Row>
                    </BetweenRow>
                     
                    {
                    (user.realname != '' || user.realname != undefined) && <FlexstartRow style={{width:"50%",marginTop:5}}>
                         <RealName>{user.realname}</RealName>
                    </FlexstartRow>
                      }
                      <div style={{marginTop:5}}>활동 시작일 : {getDateFullTime(useritem.CREATEDT)} </div>
                  </FlexstartColumn>
                </Column>
            
              </Row>  

     

              </Column>
          </BoxItem>



      
          <BoxItem> 
            <Label>활동 이력입니다</Label>
  
              
            {

                
                <FlexstartRow style={{marginTop:20}}>
                  <img src={imageDB.activity} style={{ width: 70 }} />
                  <div style={{paddingLeft:10}}>
                    <div style={{ fontSize: () => getFontSize(18) }}>{"활동이력이 없습니다"}</div>
                    <div style={{ fontSize: () => getFontSize(14),marginTop:5 }}>{"일감이 등록 되거나 지원하면 여기에 기록됩니다"}</div>
                  </div>
                   
                </FlexstartRow>
            }

          </BoxItem>


          <BoxItem> 
            <Label>받은 후기내역 입니다</Label>
            {
              reviewitems.map((data)=>(
                  <ReviewItem item={data}/>
              ))
              }
              
              {
                (reviewitems.length == 0) && <>
                  {


                    <FlexstartRow style={{ marginTop: 20 }}>
                      <img src={imageDB.chat} style={{ width: 70 }} />
                      <div style={{ paddingLeft: 10 }}>
                        <div style={{ fontSize: () => getFontSize(18) }}>{"아직 받은 후기가 없어요"}</div>
                        <div style={{ fontSize: () => getFontSize(14), marginTop: 5 }}>{"일감을 완료하면 상대방의 칭찬이 여기에 쌓입니다"}</div>
                      </div>

                    </FlexstartRow>
                  }
                </>
              }

          </BoxItem>
   

          <BoxItem> 
            <Label>받은 매너평가 입니다</Label>
  
              {   reviewcontentitems.length > 0 &&
                <div style={{marginTop:20}}>
              {
              reviewcontentitems.map((data, index)=>(
                <MainDataItem check={data.count>0}>
                  <MainDataItemText check={data.count>0}>
                  <FlexstartRow style={{height:"30px"}}>
                    <div style={{fontSize: () => getFontSize(16)}}>{data.imagecontent}</div>
                    <div style={{paddingLeft:10,fontSize: () => getFontSize(14),fontFamily:"Pretendard-SemiBold"}}>{data.content}
                    <span style={{paddingLeft:5}}>{data.count}개</span>
                    </div>
                  </FlexstartRow>
                  
                </MainDataItemText>
                </MainDataItem>
              ))
              }
              
       
                </div>
              }
              
              {
                (reviewcontentitems.length == 0 || reviewcontentitems == undefined) &&
                
                <Column style={{ marginTop: 20 }}>
                  <img src={imageDB.review} style={{ width: 100 }} />
                  <div style={{ paddingLeft: 10 }}>
                    <div style={{ fontSize: () => getFontSize(18) }}>{"아직 받은 매너평가가 없어요"}</div>
                    <div style={{ fontSize: () => getFontSize(14), marginTop: 5 }}>{"일감을 완료하면 상대방의 매너평가가 여기에 쌓입니다"}</div>
                  </div>

                  </Column>
              }
   
          </BoxItem>

        </div>)
    }



    <div style={{height:100}}/>

    </Container>
  );

}

export default MobileProfileConfig;

