
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
import { Column } from "../../../common/Column";
import { imageDB } from "../../../utility/imageData";
import { FlexstartRow } from "../../../common/Row";
import LottieAnimation from "../../../common/LottieAnimation";
import ButtonEx from "../../../common/ButtonEx";



const Container = styled.div`
  width:95%;
  margin:0 auto;
  color : #131313;

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
  font-size: 22px;


`
const SubText = styled.div`
  padding-left: 18px;
  margin-top: 10px;
  font-family: 'Pretendard';
  line-height:1.8;
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
  font-size:16px;
  padding :12px 0px;
  &::placehoder{
    fontSize:12px
  }
`

const JuminInputstyle ={
  border: 'none',
  borderBottom: '1px solid #131313',
  borderRadius: '0px',
  background: '#fff',
  width: '10px',
  fontSize:'16px',
  padding :'12px'


}
const Inputstyle ={
  border: '1px solid #C3C3C3',
  background: '#fff',
  width: '90%',
  borderRadius:'5px',
  fontSize:'16px',
  padding :'12px'

}

const Notice = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-start;
  color: #696969;
  font-size: 12px;
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
  const [juminlastnumber, setJuminlastnumber] =useState('');

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{
    setCurrentloading(currentloading);
    setName(name);
    setJuminfirstnumber(juminfirstnumber);
    setJuminlastnumber(juminlastnumber)
  }, [refresh])

  useEffect(()=>{
      async function FetchData(){
        await sleep(2000);
        setCurrentloading(false);
      }
      FetchData();
  }, [])
 
  const _handleLadyLicense = () =>{
    navigate("/Mobileladylicense",{state :{NAME :CONFIGMOVE.WORKERAUTH, TYPE : ""}});
  }
 
  return (
    <>
      {
        currentloading == true ? (<LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge}
          width={"100px"} height={'100px'}/>) :(    <Container style={containerStyle}>
           

            <Box>
              <Column style={{padding:"10px 0px"}}>
                <SubText>홍여사로 등록 되기 위해서는 실명확인 절차가 필요합니다</SubText>
                <div style={{width:"90%", margin:"20px auto"}}>
                  <input  style={Inputstyle} type="number" placeholder="실명을 입력해주세요"
                      value={name}
                      onChange={(e) => {                  
                      setName(e.target.value);
                      setRefresh((refresh) => refresh +1);
                      }}
                    />
                </div>
              </Column>
            </Box>
            <Box>
              <Column style={{padding:"10px 0px"}}>
                <SubText>등록을 위해서는 주민번호를 확인해요. 주민번호는 안전하게 보관 되며 어디에도 공개 되지 않습니다</SubText>
                <FlexstartRow style={{width:"90%", margin:"20px auto"}}>
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
                      본인 확인을 위해 주민등록증 또는 운전면허증을 준비 해주세요
                      다음 화면에서 촬영을 진행 합니다
                </SubText>

                <img src={imageDB.license} style={{width:'70%', margin:"20px"}}/>

                <Notice>
                  <TbCircleNumber1Filled style={{width:25, height:25}}/>
                  <div style={{paddingLeft:10}}>신분증의 앞면이 보이도록 놓아주세요. 어두운 바닥에 놓으면 더 잘 안식됩니다.</div>
                   
                </Notice>

                <Notice>
                  <TbCircleNumber2Filled style={{width:20, height:20}}/>
                  <div style={{paddingLeft:10}}>가이드 영역에 맞추어 반드시 신분증 원본으로 촬영 하세요.</div>
                  
                </Notice>

                <Notice>
                  <TbCircleNumber3Filled style={{width:25, height:25}}/>
                  <div style={{paddingLeft:10}}>빛이 반사 되지 않도록 주의하세요. 훼손이 심한 신분증은 거절될수 있습니다</div>
                  
                </Notice>

                <ButtonEx text={'시작하기'} width={'100'} containerStyle={{margin:"20px 0px"}}  
                  onPress={_handleLadyLicense} bgcolor={'#FF7125'} color={'#fff'} />

              </Column>
            </Box>
          </Container>)
      }
    </>
  );

}

export default MobileWorkerInfo;

