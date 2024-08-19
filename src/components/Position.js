import React, {Fragment, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { BetweenRow, Row } from "../common/Row";
import { UserContext } from "../context/User";
import { imageDB } from "../utility/imageData";
import { FILTERITMETYPE, PCMAINMENU } from "../utility/screen";
import { GiPositionMarker } from "react-icons/gi";
import "../screen/css/common.css"


const Container = styled.div`

`
const style = {
  display: "flex"
};

const Point = styled.div`
  border-radius: 100px;
  background-color: rgb(0, 184, 155);
  width: 44px;
  height: 44px;
  font-size: 12px;
  display: flex;
  color: #fff;
  justify-content: center;
  align-items: center;
  z-index:2;
  @keyframes blink-effect {
    50% {
      opacity: 0;
    }
  
  }
  
  .blink {
    animation: blink-effect 0.5s step-start infinite;
  }

`

const PointDesc = styled.div`
background: rgb(255, 255, 255);
border: 1px solid rgb(0, 184, 155);
border-radius: 15px;
width: 55%;
margin-left: -5px;
padding-left: 10px;
padding-right: 10px;
line-height: 1.2;

`

/** 제목 정리
 ** 설명
! type 에 따라 point 처리를 바꿔준자
 */

const Position =({containerStyle, type, callback,}) =>  {

  console.log("TCL: Position -> type", type)
  const { dispatch, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const _handleCurrentpos = () =>{
    callback();
  }


  return (

    <Container style={containerStyle}>
         <BetweenRow style={{height: '46px',padding: '6px',alignItems: 'center', background:"#F1F3F9", borderRadius:"99px"}}>
            

              {
                type == PCMAINMENU.HOMEMENU && 
                <div style={{width:"25%", display:"flex", alignItems:"center"}}>
                <Fragment>
                  <Point><div className="blink" style={{width:"50%"}}>업계최초</div></Point>
                  <PointDesc><span style={{color:"#00B89B", fontSize:12}}>출석시마다 언제든지 포인트를 바로 사용할 수 있습니다.</span> </PointDesc>
                </Fragment>
                </div>
              }

              { 
                type == PCMAINMENU.ROOMMENU && 
                <div style={{width:"25%", display:"flex", alignItems:"center"}}>
                <Fragment>
                  <Point><div className="blink" style={{width:"50%"}}>공간대여</div></Point>
                  <PointDesc><span style={{color:"#00B89B", fontSize:12}}>남은 공간 활용하여 개인짐 보관해주고 돈벌어보세요.</span> </PointDesc>
                </Fragment>
                </div>
              }

              {  
                type == PCMAINMENU.REGIONMENU && 
                <div style={{width:"25%", display:"flex", alignItems:"center"}}> 
                <Fragment>
                  <Point><div className="blink" style={{width:"50%"}}>범위설정</div></Point>
                  <PointDesc style={{width:"50%"}}><span style={{color:"#00B89B", fontSize:12}}>지역범위 설정을 조절해서 많은 홍여사일감이나 공간대여를 찾아보세여</span> </PointDesc>
                </Fragment>
                </div>
              }

         
            <Row>
              <div style={{lineHeight: '32px', marginRight:20}}>
                {
                    type == PCMAINMENU.ROOMMENU &&
                    <Fragment>
                        <span style={{fontSize: '16px',fontFamily:'Pretendard-SemiBold'}}>확인된 대여장소</span><span className="blink2" style={{fontSize:14}}>(현재 위치 하신 지역내 2.5KM 내외의 일감만 보여줍니다.)</span>
                    </Fragment>
                }

                {
                    type == PCMAINMENU.HOMEMENU &&
                    <Fragment>
                        <span style={{fontSize: '16px',fontFamily:'Pretendard-SemiBold'}}>확인된 일감</span><span className="blink2" style={{fontSize:14}}>(현재 위치 하신 지역내 2.5KM 내외의 일감만 보여줍니다.)</span>
                    </Fragment>
                }

{
                    type == PCMAINMENU.REGIONMENU &&
                    <Fragment>
                        <span style={{fontSize: '16px',fontFamily:'Pretendard-SemiBold'}}>확인된 일감 / 확인된 대여장소</span><span className="blink2" style={{fontSize:14}}>(현재 위치 하신 지역내 2.5KM 내외의 일감만 보여줍니다.)</span>
                    </Fragment>
                }

            </div>
            <Row>
              {/* <img src={imageDB.sample9} width={30} height={30} style={{borderRadius:50}}  /> */}
              <GiPositionMarker size={20}/>
              <div>{user.address_name}</div>
            </Row>

            <Row 
              onClick={_handleCurrentpos}
              style={{backgroundColor:"#fff",
              height:"44px",
              padding: "0px 16px 0px 16px",
              border :"1px solid #C3C3C3",
              marginLeft: "10px",
              borderRadius: "100px"}}>
              <img src={imageDB.sample10} width={20} height={20} style={{borderRadius:50}} />
              <div>지역범위설정</div>
              
            </Row>

            <Row 
              onClick={_handleCurrentpos}
              style={{backgroundColor:"#fff",
              height:"44px",
              padding: "0px 16px 0px 16px",
              border :"1px solid #C3C3C3",
              marginLeft: "10px",
              borderRadius: "100px"}}>
              <img src={imageDB.sample10} width={20} height={20} style={{borderRadius:50}} />
              <div>현재 위치 재검색</div>
              
            </Row>
            </Row>

          </BetweenRow>
          <Row style={{margin:"24px 0px"}}>
            <div style={{height:'1px', background:'#E3E3E3',width:"100%"}}></div>
          </Row>
    </Container>
  );

}

export default Position;

