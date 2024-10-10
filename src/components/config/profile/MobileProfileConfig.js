import React, {useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import ButtonEx from "../../../common/ButtonEx";
import { BetweenColumn, Column } from "../../../common/Column";
import { AroundRow, BetweenRow, FlexstartRow, Row } from "../../../common/Row";
import Text from "../../../common/Text";
import { UserContext } from "../../../context/User";
import { CONFIGMOVE, EventItems } from "../../../utility/screen";

import "../../../screen/css/common.css";
import { FaTemperatureHigh } from "react-icons/fa";

import { GrTransaction } from "react-icons/gr";
import { FaRegHeart } from "react-icons/fa";
import { DiResponsive } from "react-icons/di";
import { TbRelationOneToOne } from "react-icons/tb";
import { RiArrowRightSLine } from "react-icons/ri";
import { uploadImage } from "../../../service/UploadService";
import { Update_userinfobyusersid } from "../../../service/UserService";

const Container = styled.div`
  padding-bottom:30px;

`
const style = {
  display: "flex"
};

const BoxItem = styled.div`
  background: #fff;
  display: flex;
  flex-direction : column;
  width: 85%;
  margin: 10px auto;
  border-radius: 10px;
  padding: 10px;
  font-size:12px;
`

const Name = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: 16px;
  padding-left:5px;
`
const TemperatureLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 14px;
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
  font-size: 14px;
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
  font-size: 16px;
  padding: 20px 0px;
`
const Point = styled.div`
  color: #ff4e19;
  padding: 10px 18px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-family: 'Jalnan2';
  border: 2px dotted #ff4e19;

`
const ULITEM = styled.ul`
  padding-left: 15px;
  list-style-type: disc;
  line-height: 2;
  margin-top: 10px;
`


const MobileProfileConfig =({containerStyle}) =>  {

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

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setTemperature(temperature);
    setImg(img);
  }, [refresh])

  useEffect(()=>{
      async function FetchData(){
        setImg(user.userimg);
      }
      FetchData();
  }, [])

  const handleUploadClick = (e) => {
    fileInput.current.click();
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
      setImg(uri);

      user.userimg = uri;
      dispatch(user);

      const USERINFO = user;
      const USERS_ID = user.users_id;
  
      await Update_userinfobyusersid({USERINFO, USERS_ID});
      console.log("TCL: _handleSave -> user", user);
      setRefresh((refresh) => refresh +1);



    });
  };

  

  const _handleNameMove = () =>{
    navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.PROFILENAME, TYPE : ""}});
  }

  const _handleBadge= () =>{
    navigate("/Mobileconfigcontent",{state :{NAME :CONFIGMOVE.PROFILEBADGE, TYPE : ""}});
  }
  
 
  return (

    <Container style={containerStyle}>

    <BoxItem style={{padding:"30px 10px"}}>

      <Column style={{justifyContent:"space-between", width:"100%"}}>
        <Row style={{justifyContent:"flex-start", width:"90%"}}>
          <img src={img}  onClick={handleUploadClick} style={{width:"82px", borderRadius:"50px"}}/>
          <Name>{user.nickname}</Name>
        </Row>  

        <input
        type="file"
        ref={fileInput}
        onChange={handlefileuploadChange}
        style={{ display: "none" }}
        />


        <ButtonEx text={'대화명 설정'} width={'85'}  onPress={_handleNameMove}
        containerStyle={{marginTop:20, marginBottom:20, height:34}}
         bgcolor={'#A3A3A3'} color={'#fff'} />

        <TemperatureLine>
           <div>홍여사 온도 <FaTemperatureHigh size={12} color={'#FF4E19'}/>
           <span style={{fontSize:10, fontFamily:"Pretendard-Light"}}>홍여사는 기본온도가 36도에요</span>
           </div>
           <div>
            <div style={{display:"flex"}}>
              <Text containerStyle={{fontFamily:"Pretendard-Bold"}} value={ parseInt(temperature *100 / 100) + '도'} size={16} color={'#FF4E19'} ></Text>
            </div>
          </div>  
        </TemperatureLine>
   
        <AroundRow style={{width:"100%"}}>
    
            <Column style={{alignItems:"unset", width:"100%"}}>
              <progress value={temperature} min="0" max="100"
              className="profile-progress-bar"
              style={{width:"100%", margin:"10px 0px"}}></progress>

              <PointBox>
                <PointBoxInner>
                  <div style={{display:"flex"}}>
                  <div>거래지수</div>
                  </div>
                  <div style={{lineHeight:1.8,marginTop:5}}>거래 내역을 토대로 지수를 산출해요</div>
                </PointBoxInner>
                <Point>
                  1
                </Point>

              </PointBox>
              <PointBox>
                <PointBoxInner>
                <div style={{display:"flex"}}>
                  호감지수
                  </div>
                <div style={{lineHeight:1.8,marginTop:5}}>호감 표현이 많을 수록 지수가 높아져요</div>
                </PointBoxInner>
                <Point>
                  2
                </Point>
              </PointBox>
              <PointBox>
                <PointBoxInner>
                <div style={{display:"flex"}}>
                  체팅응답률
                </div>
                <div style={{lineHeight:1.8,marginTop:5}}>응답이 빠를 수록 응답률이 높아 진다</div>
                </PointBoxInner>
                <Point>
                  1
                </Point>
              </PointBox>
       
           
            </Column>

        </AroundRow>
      </Column>
    </BoxItem>



    <BoxItem> 

      <div>주소지 변경 내역입니다</div>
      <ULITEM>
      <li> 다산 1동 미인증</li>
      <li> 성북동 미인증</li>
      <li> 다산 2동 미인증</li>
      </ULITEM>
         

    </BoxItem>


    <BoxItem> 


      <div>최근 3일내 이력 입니다</div>

      <ULITEM>
      <li> 의뢰 1회 계약완료 1회 2024.09.17</li>
      <li> 일감 등록 2024.09.17</li>
      <li> 공간 대여 등록 2024.09.17</li>
      </ULITEM>
    </BoxItem>

    <BoxItem>
     

          <SubLabel onClick={_handleBadge}>
            <Row>
           
              <SubLabelContent>홍여사 활동뱃지</SubLabelContent>
            </Row>
            <RiArrowRightSLine size={20} style={{paddingRight:5}}/>    
          </SubLabel>

    </BoxItem>



    </Container>
  );

}

export default MobileProfileConfig;

