import React, {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";
import {
  HashRouter,
  Route,
  Redirect,
  BrowserRouter,
  Routes,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import styled from "styled-components";




import { FaCamera } from "react-icons/fa";
import { uploadImage } from "../../service/UploadService";
import ButtonEx from "../../common/ButtonEx";
import LottieAnimation from "../../common/LottieAnimation";
import { LoadingCommunityStyle } from "../../screen/css/common";
import { imageDB } from "../../utility/imageData";
import { UserContext } from "../../context/User";
import { Update_userinfobyusersid } from "../../service/UserService";
import { sleep } from "../../utility/common";
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import { Column, FlexstartColumn } from "../../common/Column";
import { getFontSize } from "../../utility/fontsize";

const Container = styled.ul`
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
  flex-direction: column;
  list-style-type :disc;
`
const PictureBoxLayer = styled.div`
  height: 250px;
  border: 1px solid #ededed;
  margin-top: 20px;
  display:flex;
  justify-content:center;
  align-items:center;
  width:95%;

`
const LineScan = styled.div`
  position: relative;
  height: 70px;
  background: #ff004e40;
  width: 100%;
    &:after { 
      content: "스캔중입니다.";
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top:25px;
      color:#fff;
      font-size: ${() => getFontSize(18)}px;
  } 
`
const BoxLayerContent = styled.li`
  font-size: ${() => getFontSize(12)}px;
  margin:10px;
`
const Bottom = styled.div`
position: fixed;
bottom: 20px;
width:90%;
`

const ResultContent = {
  width: '92%',
  height: '300px',
  fontSize: '14px',
  fontFamily: 'Pretendard-Regular',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"1px solid #ededed",
  marginTop:10,
  padding :10,
  fontFamily: 'Pretendard-Light'

}
const SampleDisplay  = styled.div`

  background: #67646421;
  padding: 10px 10px;
  line-height: 2;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;



`



const MobileLadyResumecontainer = ({role, REALNAME}) => {
  const navigate = useNavigate();
  const { dispatch, user } = useContext(UserContext);
  const [loading,setLoading] = useState(false);
  const [refresh, setRefresh] = useState(1);
  const [licenseimg, setLicenseimg] = useState('');

  const [extractvalue, setExtractvalue] = useState('');
  const [state, setState] = useState(0);
  const fileInput = useRef();


  const [resume, setResume] = useState(user.resume);

  const onResumeChange = async (e) => {
    setResume(e.target.value);
    setRefresh((refresh) => refresh +1);
  }

  useEffect(()=>{
    window.scrollTo(0, 0);
    return () => {};
  }, []);

  useEffect(()=>{
    setResume(resume);
  }, [refresh])

  const _handleRegist = async() =>{
    console.log("user information", user);

    // user.resume = resume;
    // user.realname = REALNAME;
    // dispatch(user);

    //dispatch({ ...user,resume: resume, realname: REALNAME});
    

    dispatch({
      USERINFO: {
        resume: resume,
        realname: REALNAME
      },
    });

    const USERINFO = user.USERINFO;
    const USERS_ID = user.USERS_ID;
    await Update_userinfobyusersid({USERINFO,USERS_ID });
    await sleep(1000);

    navigate("/Mobileconfig")
  }

  
  return (
    <>

    {loading == true ? (<LottieAnimation containerStyle={LoadingCommunityStyle} animationData={imageDB.loading}
      width={"50px"} height={'50px'} />) :

        <Container style={{width:"90%", margin:"0 auto", paddingTop:"50px"}}>
      


          <FlexstartColumn style={{justifyContent:"flex-start"}}>
            {/* <BetweenRow style={{width:"100%"}}>
            <div style={{fontSize: () => getFontSize(18)}}>한줄 소개</div>

            </BetweenRow> */}

            
            <SampleDisplay>
              <Row>
                <img src={imageDB.ic_myinfo_menu_hong} style={{ width: 20, height: 20 }} />
                <div style={{ fontSize: () => getFontSize(14), paddingLeft:10 }}>자신을 소개하는 글을 적어주세요</div>
              </Row>
    
              <div style={{fontSize: () => getFontSize(14)}}>고객이 선택하는데 도움이 될만한  구체적으로 장점을 적어주세요</div>
              <div style={{fontSize: () => getFontSize(14)}}>내용이 구체적일수록 선택이 잘될수 있습니다</div>
              <div style={{fontSize: () => getFontSize(14)}}>이메일 전화번호등 개인정보 작성은 할수 없습니다</div>
            </SampleDisplay>
     
      
          </FlexstartColumn>
   
  
          <textarea style={ResultContent} value={resume} onChange={onResumeChange}/>

   
          <Bottom>
          <ButtonEx text={'소개글 등록'} width={'95'}  
            containerStyle={{fontSize: () => getFontSize(16)}}
            onPress={_handleRegist} bgcolor={'#FF7125'} color={'#fff'} />
          </Bottom>
      

        </Container>


    }
    </>
  );
};

export default React.memo(MobileLadyResumecontainer);
