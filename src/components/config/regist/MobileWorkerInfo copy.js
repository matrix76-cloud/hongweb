
import React, {useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { GoDotFill } from "react-icons/go";
import { TbCircleNumber1Filled } from "react-icons/tb";
import { TbCircleNumber2Filled } from "react-icons/tb";
import { TbCircleNumber3Filled } from "react-icons/tb";
import { UserContext } from "../../../context/User";
import { sleep } from "../../../utility/common";
import { CONFIGMOVE } from "../../../utility/screen";
import { Column, FlexstartColumn } from "../../../common/Column";
import { imageDB } from "../../../utility/imageData";
import { FlexstartRow, Row } from "../../../common/Row";
import LottieAnimation from "../../../common/LottieAnimation";
import ButtonEx from "../../../common/ButtonEx";
import { LoadingChatAnimationStyle, LoadingMainAnimationStyle } from "../../../screen/css/common";
import LazyImage from "../../LazyImage";
import { setRef } from "@mui/material";
import MobileLadyAuth from "./MobileLadyAuth";
import { Update_userinfobyusersid } from "../../../service/UserService";
import { Toaster, toast } from 'sonner';
import { getFontSize } from "../../../utility/fontsize";


const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  color: #131313;

  background: #fff;


`
const style = {
  display: "flex"
};

const ResultContent = {
  width: '180px',
  fontSize: '14px',
  fontFamily: 'Pretendard-Light',
  lineHeight: 2,
  outline:"none",
  resize :"none",
  border:"none",
 
}

const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}

const Label = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding-left: 30px;
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(22)}px;


`
const SubText = styled.div`
  margin : 10px auto;
  font-family: 'Pretendard-Regular';
  font-size: ${() => getFontSize(16)}px;
  width:80%;
  line-height:2;
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 95%;
  margin: 10px auto;
  background: #fff;
  border-radius: 20px;


`

const JuminFirstInput = styled.input`

  border: none;
  border-bottom: 1px solid #131313;
  border-radius: 0px;
  background: #fff;
  width: 55%;
  font-size: ${() => getFontSize(16)}px;
  padding :12px 0px;
  &::placehoder{
    fontSize: () => getFontSize(12)px
  }
`

const JuminInputstyle ={
  border: 'none',
  borderBottom: '1px solid #131313',
  borderRadius: '0px',
  background: '#fff',
  width: '10px',
  fontSize:'16px',
  padding :'8px'


}


const Inputstyle ={
  border: '1px solid rgb(200 200 200)',
  background: 'rgb(255, 255, 255)',
  width: '90%',
  borderRadius: '5px',
  fontSize: '16px',
  padding: '10px 12px'

}

const BankInputstyle = {
  border: '1px solid rgb(200 200 200)',
  background: 'rgb(255, 255, 255)',
  width: '75%',
  borderRadius: '5px',
  fontSize: '16px',
  padding: '10px 12px'

}



const InputLayerstyle = `
  .input-container {
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: bottom 0.3s ease -in -out;
  }
`





const Notice = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  color: #696969;
  font-size: ${() => getFontSize(12)}px;
  width: 90%;
  margin: 10px;

`

const MobileWorkerInfo =({containerStyle}) =>  {

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
  const [currentloading, setCurrentloading] = useState(true);
  const [juminnumber, setJuminnumber] = useState('');
  const [name, setName] = useState('');
  const [juminfirstnumber, setJuminfirstnumber] =useState('');
  const [juminlastnumber, setJuminlastnumber] = useState('');
  const [pos, setPos] = useState(0);
  const [bankname, setBankname] = useState('');
  const [banknum, setBanknum] = useState('');
  const [bankuser, setBankuser] = useState('');


  const [isFocused, setIsFocused] = useState(false);

  const [initialHeight, setInitialHeight] = useState(window.innerHeight);



  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(() => {
    const handleTouchMove = (event) => {
      event.preventDefault(); // 다른 영역에서는 차단
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);



  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight < initialHeight) {
        setKeyboardVisible(true); // 키보드가 올라옴
      } else {
        setKeyboardVisible(false); // 키보드가 내려감
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initialHeight])


  useEffect(()=>{
    setCurrentloading(currentloading);
    setName(name);
    setJuminfirstnumber(juminfirstnumber);
    setJuminlastnumber(juminlastnumber);
    setBankname(bankname);
    setBankuser(bankuser);
    setBanknum(banknum);
    setJuminnumber(juminnumber);
    setPos(pos);
    setIsFocused(isFocused);
  }, [refresh])

  useEffect(()=>{
  
  }, [])
 
  const _handleLadyLicense = () =>{

    if(name ==""){
      alert("이름을 입력해주세요");
      return;
    }
    
    if(juminfirstnumber == ""){
      alert("주민번호를 입력해주세요");
      return;
    }
    navigate("/Mobileladylicense",{state :{NAME :CONFIGMOVE.WORKERAUTH, USER : name, USERJUMIN:juminfirstnumber}});
  }
 
  const _handlePos = (pos) => {
    setPos(pos);
    setRefresh((refresh) => refresh + 1);
  }

  const _handleComplete = async() => {
    


    const USERINFO = user.USERINFO;
    const USERS_ID = user.USERS_ID;


    USERINFO.worker = true;
    USERINFO.bankname = bankname;
    USERINFO.banknum = banknum;
    USERINFO.bankuser = bankuser;
    USERINFO.jumin = juminnumber;
  

    // user.bankname = bankname;
    // user.banknum = banknum;
    // user.bankuser = bankuser;
    // user.worker = true;
    // user.jumin = juminnumber;

    // dispatch(user);

    await Update_userinfobyusersid({ USERINFO, USERS_ID });

    toast.info("홍여사 일꾼으로 등록되었습니다. 이제 일감에 자유롭게 지원할수 있습니다", {
      duration: 1000,
      style: { background: "#FFF", color: "#131313", fontSize: () => getFontSize(16), border: "none" }, // 스타일 변경
    })

    navigate("/Mobileconfig");

  }
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
     
      if (name.length >= 3) {
        _handlePos(1);
      }
      
      setIsFocused(false);
    
      setRefresh((refresh) => refresh + 1);
    }

  }
  return (        
    <Container style={containerStyle}>
      <style>{InputLayerstyle}</style>
      {
        (  
            <>
            {/* {
              pos == 0 && <Box>

                <div className="input-container" style={{ bottom: isFocused ? "400px" : "300px" }}>
                  <img src={imageDB.logo} style={{ marginTop: 30, width: "100px", height: "100px" }} />
                  <Column style={{ padding: "10px 0px" }}>
                    <SubText>홍여사 등록을 위해서는 실명확인 절차가 필요합니다</SubText>
                    <div style={{ width: "80%", margin: "5px auto 0px" }}>

                      <input style={Inputstyle} type="text" placeholder="실명을 입력해주세요"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setRefresh((refresh) => refresh + 1);
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />

                    </div>
                  </Column>
                </div>
               
                <div style={{ position: "absolute", bottom: 50, width: "90%" }}>
                  {name.length >= 3 ? (<ButtonEx text={'다음(1/4)'} width={'90'} height={'40'} containerStyle={{ margin: "20px auto" }}
                    onPress={() => { _handlePos(1) }} bgcolor={'#FE6625'} color={'#fff'} />) : (<ButtonEx text={'다음(1/4)'} width={'90'}
                      height={'40'} containerStyle={{ margin: "20px auto" }} bgcolor={'#d0d0d0'} color={'#131313'} />
                  )}
                </div>
                </Box>
            }
            
            {
              pos == 1 && <Box>

                <div className="input-container" style={{ bottom: isFocused ? "400px" : "300px" }}>
                  <img src={imageDB.logo} style={{ marginTop: 30, width: "100px", height: "100px" }} />
                  <Column style={{ padding: "10px 0px" }}>
                    <SubText>등록을 위해서는 주민번호를 확인해요. 주민번호는 안전하게 보관 되며 어디에도 공개 되지 않습니다</SubText>
                    <FlexstartRow style={{ width: "80%", margin: "10px auto" }}>

                      <JuminFirstInput type="number" placeholder="주민등록 번호 앞 6자리"
                        id="jumin-input"
                        value={juminfirstnumber}
                        onChange={(e) => {
                          setJuminfirstnumber(e.target.value);
                          setRefresh((refresh) => refresh + 1);
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                      <div style={{ margin: "0 10px" }}>-</div>

                      <input style={JuminInputstyle} type="number" placeholder=""
                        value={juminlastnumber}
                        onChange={(e) => {
                          setJuminlastnumber(e.target.value);
                          setRefresh((refresh) => refresh + 1);
                    
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                      <GoDotFill />
                      <GoDotFill />
                      <GoDotFill />
                      <GoDotFill />
                      <GoDotFill />
                      <GoDotFill />

                    </FlexstartRow>
                  </Column>
                </div>

                <div style={{ position: "absolute", bottom: 50, width: "100%" }}>
                  {(juminfirstnumber.length == 6 && juminlastnumber.length == 1) ? (

                    <Row style={{ width: "90%", margin:"0 auto" }}>
                      
                      <ButtonEx text={'이전단계'} width={'48'} height={'40'} containerStyle={{ margin: "0px auto" }}
                        onPress={() => { _handlePos(0) }} bgcolor={'#232222'} color={'#fff'} />
                      
                      <ButtonEx text={'다음(2/4)'} width={'48'} height={'40'} containerStyle={{ margin: "0px auto" }}
                        onPress={() => { _handlePos(2) }} bgcolor={'#FE6625'} color={'#fff'} />
                      
                    </Row>
                    

                  
                  
                  ) : (
                      <Row style={{ width: "90%", margin: "0 auto" }}>
                        
                    <ButtonEx text={'이전단계'} width={'48'} height={'40'} containerStyle={{ margin: "0px auto" }}
                          onPress={() => { _handlePos(0) }} bgcolor={'#232222'} color={'#fff'} />

                    <ButtonEx text={'다음(2/4)'} width={'48'}
                          height={'40'} containerStyle={{ margin: "0px auto" }} bgcolor={'#9f9b9a'} color={'#131313'} />
                  </Row>
                      
                  )}
                </div>
              </Box>
            } */}
            {
              pos == 0 && <Box>
                <div className="input-container">
                  {/* <img src={imageDB.logo} style={{ marginTop: 40, width: "80px", height: "80px" }} /> */}
                  <Column style={{ padding: "10px 0px", }}>
                    <SubText>홍여사 일감 완료시 입금 받으실 계좌정보와 주민번호를 입력해주세요. 주민번호는 종합소득세 3.3% 신고에 사용됩니다.</SubText>
                    <FlexstartColumn style={{ width: "85%", margin: "10px auto" }}>

                      <Row style={{ width: "100%" }}>
                        <div style={{marginRight:"5px", width:"50%"}}>
                          <input style={BankInputstyle} type="text" placeholder="입금은행"
                            value={bankname}
                            onChange={(e) => {
                              setBankname(e.target.value);
                              setRefresh((refresh) => refresh + 1);
                            }}

                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                          />
                        </div>
                 



                        <input style={Inputstyle} type="number" placeholder="계좌번호"
                          value={banknum}
                          onChange={(e) => {
                            setBanknum(e.target.value);
                            setRefresh((refresh) => refresh + 1);
                          }}

                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                        />
                      </Row>
                 
                      <div style={{ height: 10 }}></div>

                      <input style={Inputstyle} type="text" placeholder="계좌주"
                        value={bankuser}
                        onChange={(e) => {
                          setBankuser(e.target.value);
                          setRefresh((refresh) => refresh + 1);
                        }}
                   
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                      <div style={{ height: 10 }}></div>
                      <input style={Inputstyle} type="number" placeholder="주민번호"
                        value={juminnumber}
                        onChange={(e) => {
                          setJuminnumber(e.target.value);
                          setRefresh((refresh) => refresh + 1);
                        }}

                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />

                    </FlexstartColumn>
                  </Column>
                </div>

                <div style={{ position: "absolute", bottom: 50, width: "100%" }}>
                  {(bankname != '' && banknum != '' && bankuser != '' && juminnumber != '') ? (

                    <Row style={{ width: "90%", margin: "0 auto" }}>

                      {/* <ButtonEx text={'이전단계'} width={'48'} height={'40'} containerStyle={{ margin: "0px auto" }}
                        onPress={() => { _handlePos(1) }} bgcolor={'#232222'} color={'#fff'} /> */}

                      <ButtonEx text={'등록'} width={'90'} height={'40'} containerStyle={{ margin: "0px auto" }}
                        onPress={_handleComplete} bgcolor={'#FE6625'} color={'#fff'} />

                    </Row>

                  ) : (
                    <Row style={{ width: "90%", margin: "0 auto" }}>

                      {/* <ButtonEx text={'이전단계'} width={'48'} height={'40'} containerStyle={{ margin: "0px auto" }}
                          onPress={() => { _handlePos(1) }} bgcolor={'#232222'} color={'#fff'} /> */}

                      <ButtonEx text={'등록'} width={'90'}
                        height={'40'} containerStyle={{ margin: "0px auto" }} bgcolor={'#ededed'} color={'#131313'} />
                    </Row>

                  )}
                </div>
              </Box>
            }
            {/* {
              pos == 3 && <Box>
                <Column style={{ padding: "10px 0px" }}>
                  <SubText>
                    본인확인을 위해 주민등록증 또는 운전면허증이 필요합니다
                  </SubText>

                  <Row style={{width:"90%"}}>
                    <Notice>
                      <div>신분증의 앞면이 보이도록 놓아주세요.빛이 반사 되지 않도록 주의하세요.</div>
                    </Notice>
                  </Row>
                </Column>
                

                <MobileLadyAuth USER={name }
                  USERJUMINF={juminfirstnumber}
                  USERJUMINL={juminlastnumber}
                  Bankname={ bankname}
                  Bankuser={ bankuser}
                  Banknum={banknum}
                />
                </Box>
            } */}


        {/* <Box>
          <Column style={{padding:"10px 0px"}}>
            <SubText>등록을 위해서는 주민번호를 확인해요. 주민번호는 안전하게 보관 되며 어디에도 공개 되지 않습니다</SubText>
            <FlexstartRow style={{width:"90%", margin:"10px auto"}}>
              <JuminFirstInput type="number" placeholder="주민등록 번호 앞 6자리"
                id="jumin-input" 
                  value={juminfirstnumber}
                  onChange={(e) => {            
                  setJuminfirstnumber(e.target.value);
                  setRefresh((refresh) => refresh +1);
                  }}
                />
              <div style={{margin:"0 10px"}}>-</div> 

              <input  style={JuminInputstyle} type="text" placeholder=""
                  value={juminlastnumber}
                  onChange={(e) => {            
                  setJuminlastnumber(e.target.value);
                  setRefresh((refresh) => refresh +1);
                  }}
                />
              <GoDotFill/>
              <GoDotFill/>
              <GoDotFill/>
              <GoDotFill/>
              <GoDotFill/>
            </FlexstartRow>
          </Column>
        </Box>
        <Box>
          <Column style={{padding:"10px 0px"}}>
            <SubText>
                  본인확인을 위해 주민등록증 또는 운전면허증이 필요합니다
            </SubText>

            <Row>
              <img src={imageDB.license} style={{width:'30%', margin:"10px", height:50}}/>
              <Notice>
                <div>신분증의 앞면이 보이도록 놓아주세요.빛이 반사 되지 않도록 주의하세요.</div>     
              </Notice>
            </Row>
   
        
            <ButtonEx text={'시작하기'} width={'90'} containerStyle={{margin:"20px 0px"}}  
              onPress={_handleLadyLicense} bgcolor={'#0076CE'} color={'#fff'} />

          </Column>
        </Box> */}
        </>
  
        )
      }
      <Toaster position="bottom-right" richColors />
    </Container>
  );
}

export default MobileWorkerInfo;

