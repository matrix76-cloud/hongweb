import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Column } from "../../../common/Column";
import { BetweenRow, FlexstartRow } from "../../../common/Row";
import { UserContext } from "../../../context/User";
import { imageDB } from "../../../utility/imageData";
import { EventItems } from "../../../utility/screen";
import { WORKNAME } from "../../../utility/work_";

import { PiLockKeyLight } from "react-icons/pi"
import { BADGE } from "../../../utility/badge";
import { setRef } from "@mui/material";

import { IoIosRefresh } from "react-icons/io";
import { _handleCreateName } from "../../../utility/data";
import { CountryAddress } from "../../../utility/region";
import MobileSuccessPopup from "../../../modal/MobileSuccessPopup/MobileSuccessPopup";
import { Update_userinfobyusersid } from "../../../service/UserService";

const Container = styled.div`
  width:"100%"
`
const style = {
  display: "flex"
};

const Label = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding-left: 30px;
  font-family: 'Pretendard-SemiBold';
  font-size: 22px;

`

const EventBox = styled.div`

  margin-top:30px;
  width: 95%;
  margin-bottom: 30px;
  cursor: pointer;
  transition: .2s all;
  margin:0 auto;
  
`
const txtWrap = {
  backgroundColor:'#fafafa',
  padding: '18px 20px 24px',
  lineHeight:2
}

const tit ={
  fontSize: '18px',
  fontWeight: 700,
}

const day = {
  color: '#797979',
  fontSize: '16px'
}

const FilterBox = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: row;
  background: ${({clickstatus}) => clickstatus == true ? ('#FF7125') :('#fff') };
  border:  ${({clickstatus}) => clickstatus == true ? (null) :('1px solid #C3C3C3') };
  margin-right: 3px;
  border-radius: 4px;
  padding: 0px 15px;
  height:30px;
  flex: 0 0 auto; /* 아이템의 기본 크기 유지 */

`
const FilterBoxText = styled.div`
color: ${({clickstatus}) => clickstatus == true ? ('#FFF') :('#131313') };
font-size:14px;
margin-left:5px;
font-weight:600;

`
const Box = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction:column;
  width: 33%;
  border-radius: 15px;
  height:110px;


`
const BoxImg = styled.div`
  border-radius: 50px;
  background: ${({enable}) => enable == true ? ('#fdeda8'):('#ededed')};
  padding: 20px;
  display :flex;
`

const SubText = styled.div`
  padding-left: 18px;
  margin-top: 10px;
  font-family: 'Pretendard';
  line-height:1.8;
`
const Inputstyle ={
  border: '1px solid #C3C3C3',
  background: '#fff',
  width: '90%',
  borderRadius:'5px',
  fontSize:'16px',
  padding :'12px'

}

const ReqButton = styled.div`
  height: 44px;
  width: 90%;
  margin : 0 auto;
  border-radius: 4px;
  background: ${({enable}) => enable == true ? ('#FF7125') :('#dbdada')};
  color:  ${({enable}) => enable == true ? ('#fff') :('#999')};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family:"Pretendard-SemiBold";
  font-size: 18px;

`
const RefreshItem = styled.div`
  position: absolute;
  left: 85%;
  z-index: 5;
  margin-top: 10px;
  font-size: 20px;


`



const MobileProfileName =({containerStyle}) =>  {

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

  const [name, setName] = useState('');
  const [enable, setEnable] = useState(false);
  const [success, setSuccess] = useState(false);

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setName(name);
    setEnable(enable);
    setSuccess(success);
  }, [refresh])

  useEffect(()=>{
      async function FetchData(){
       console.log("user", user);
       setName(user.nickname);
      }
      FetchData();
  }, [])
  

  const handleNameKeyDown = (event)=>{
    if (event.key === 'Enter') {
      
    }
  }
  const _handleautocreate = () =>{

    let nickname = _handleCreateName(CountryAddress(user.address_name));

    setName(nickname);
    setEnable(true);
    setRefresh((refresh) => refresh +1);

    

  }

  const registsuccesscallback = () =>{
    setSuccess(false);
    setRefresh((refresh) => refresh +1); 
  }

  const _handleSave = async() =>{
    setSuccess(true);

    user.nickname = name;
    dispatch(user);


    const USERINFO = user;
    const USERS_ID = user.users_id;

    await Update_userinfobyusersid({USERINFO, USERS_ID});

    console.log("TCL: _handleSave -> user", user);

    setRefresh((refresh) => refresh +1); 
  }
 
  return (

    <Container style={containerStyle}>

        <Column style={{width:"95%",margin: "0 auto"}} >   

              <SubText>홍여사에서 활동하려는 대화명을 자동으로 또는 수동으로 입력해주세요</SubText>
              <div style={{width:"90%", margin:"20px auto", display:"flex"}}>
                <input  style={Inputstyle} type="text" placeholder="대화명을 입력해주세요"
                      value={name}
                      onKeyDown={handleNameKeyDown} // Enter 키를 감지하는 이벤트
                      onChange={(e) => {
                        setName(e.target.value);

                        if(e.target.value == ''){
                          setEnable(false);
                        }else{
                          setEnable(true);
                        }
                   
                        setRefresh((refresh) => refresh +1);
                      }}
                  />
                <RefreshItem onClick={_handleautocreate}><IoIosRefresh/></RefreshItem>
              </div>
              <ReqButton enable={enable} onClick={_handleSave}>저장</ReqButton>

              {
                success == true &&  <MobileSuccessPopup callback={registsuccesscallback} content={'정상적으로 대화명이 변경되었습니다'} />
              }


        </Column>

    </Container>
  );

}

export default MobileProfileName;

