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

const Container = styled.div`
  width:"100%"
`
const style = {
  display: "flex"
};

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

const WorkItems=[
  {name : BADGE.WORKER1, img:"", enable:false},
  {name : BADGE.WORKER2, img:"", enable:false},
  {name : BADGE.WORKER3, img:"", enable:false},
  {name : BADGE.WORKER4, img:"", enable:false},
  {name : BADGE.WORKER5, img:"", enable:false},
  {name : BADGE.WORKER6, img:"", enable:false},
  {name : BADGE.WORKER7, img:"", enable:true},
  {name : BADGE.WORKER8, img:imageDB.babycare, enable:true, acquire : true},
  {name : BADGE.WORKER9, img:"", enable:false},
  {name : BADGE.WORKER10, img:"", enable:false},
  {name : BADGE.WORKER11, img:"", enable:false},
  {name : BADGE.WORKER12, img:"", enable:false},
  {name : BADGE.WORKER13, img:"", enable:false},
  {name : BADGE.WORKER14, img:"", enable:false},
  {name : BADGE.WORKER15, img:"", enable:true},
  {name : BADGE.WORKER16, img:"", enable:false},
  {name : BADGE.WORKER17, img:"", enable:false},
  {name : BADGE.WORKER18, img:"", enable:false},
  {name : BADGE.WORKER19, img:"", enable:false},
  {name : BADGE.WORKER20, img:"", enable:false},
  {name : BADGE.WORKER21, img:"", enable:false},

]

const MobileProfileBadge =({containerStyle}) =>  {

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

  useLayoutEffect(() => {
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
      return () => {};
  }, []);

  useEffect(()=>{

  }, [refresh])

  useEffect(()=>{
      async function FetchData(){
       
      }
      FetchData();
  }, [])
  

  const _handeleventdetail = (data) =>{
    console.log("TCL: _handeleventdetail -> data", data)
  
      
      navigate("/Mobileeventdetail",{state :{EVENTITEM :data}});
  

  }
  
 
  return (

    <Container style={containerStyle}>

        <Column style={{width:"95%",margin: "0 auto"}} >   
            <BetweenRow style={{flexWrap:"wrap", width:"100%"}}>
              {
                WorkItems.map((data, index)=>(
                  <Box onClick={()=>{}}  >
                    <BoxImg enable={data.enable}>
                      
                      {
                        data.enable== true ? (
                          <>
                            {
                              data.img == '' ? (   <PiLockKeyLight size={28} color={"#000"}/>) :(
                                <img src={data.img} style={{width:32}}/>
                              )
                            }         
                          </>
                        ) 
                        :(  <PiLockKeyLight size={28} color={"#8c8b8b"}/>)
                      }
                    
                    
                    </BoxImg>
                    <div style={{ fontSize:12, color:"#131313", fontFamily:"Pretendard-SemiBold", marginTop:5}}>{data.name}</div>
                  </Box>
                ))
              }
            </BetweenRow>
        </Column>

    </Container>
  );

}

export default MobileProfileBadge;

