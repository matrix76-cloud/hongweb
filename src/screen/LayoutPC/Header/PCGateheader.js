import React, { Fragment, useContext, useEffect, useInsertionEffect, useState } from "react";

import { Link, Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { imageDB } from "../../../utility/imageData";
import { UserContext } from "../../../context/User";
import { Badge, setRef } from "@mui/material";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import Image from "../../../common/Image";
import { WORKNAME } from "../../../utility/work";
import { WORK } from "../../../utility/db";
import { colors } from "../../../theme/theme";
import { AroundRow, BetweenRow, FlexstartRow, Row } from "../../../common/Row";
import Categorymenu from "../../../common/Categorymenu";
import { CENTERTYPE, CONFIGMOVE, EventItems, EVENTTYPE, FILTERITMETYPE, GUIDETYPE, LAWTYPE, LoadingType, PCMAINMENU } from "../../../utility/screen";


import { CONVENIENCEMENU, FAMILYMENU, LIFEMENU, MEDICALMENU, PERFORMANCEMENU, TOURISTMENU, WEATHERMENU } from "../../../utility/life";

import "./PCMainheader.css";
import "./PCGateheader.css";
import { sleep } from "../../../utility/common";
import { readuserbyphone, Update_usertoken } from "../../../service/UserService";
import { Column, FlexstartColumn } from "../../../common/Column";
import { MdKeyboardArrowDown } from "react-icons/md";

import { getFontSize } from "../../../utility/fontsize";
const PCHeader = styled.div`
  height: ${({height}) => height}px;
  text-align: center;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  z-index: 2;
  width: 1400px;


`;

const CategoryContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding:10px 0px;
  box-shadow: 0 1px 5px rgb(0 0 0 / 4%);

`;


const OneHeaderOptionMenu = styled.div`
  display: flex;
  flex-direction:row;
  font-size: ${() => getFontSize(14)}px;
  justify-content:space-around;
  width:40%;
`
const OneHeaderLoginMenu = styled.div`
  display: flex;
  justify-content: space-around;
  margin-right: 30px;
  align-items: center;
`;

const EventDesc = styled.div`

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
  margin-left:20px;
  font-size: ${() => getFontSize(14)}px;
  line-height: 20px;
  color: #5a5a5a;
`

const MainMenuText = styled.div`
  font-size: ${() => getFontSize(20)}px;
  color: ${({clickstatus}) => clickstatus == true ? ('#ff7e19') :('#131313') };
  font-weight: ${({clickstatus}) => clickstatus == true ? ('600') :('400') };
`

const EventMainText ={
  fontSize: '14px',
  color: '#fff',
  fontFamily:"Pretendard-SemiBold",
  fontWeight:600,
}

const EventSubText ={
  fontSize: '14px',
  color: '#fff',
  fontWeight:400,
}

const EventBtn ={
  display:"flex",
  justifyContent:"space-between",
  width:'30%',

}


const CategoryLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height:30px;
`;
const CategoryItem = styled.div`
  height: 48px;
  line-height: 48px;
  font-size: ${() => getFontSize(16)}px;
  display: inline-block;
  color: #595959;

`




const OneContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 34px;
  background-color: #f39435;
  position: fixed;
  z-index: 5;
  color: #595959;
  font-size: ${() => getFontSize(14)}px;
`;

const TwoContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  z-index: 5;


  
`;




const LineControl = styled.div`

  width: 100%;
  position: absolute;
  margin-top: 45px;
`;

const Inputstyle ={
  border: '1px solid #C3C3C3',
  background: '#fff',
  width: '100%',
  borderRadius:'5px',
  fontSize:'16px',
  padding :'8px'

}



const Searchstyle={
  position: "relative",
  left: '-35px'
}
const Search2style={
  position: "relative",
  left: '0px',
  top: '5px'
}


const LoginBtn = styled.div`
  padding: 10px 30px;
  background: #ffd6ac;
  border-radius: 10px;
`;

const NavItemLayer = styled.div`

  position: absolute;
  left : ${({left}) => left};
`
const DropdownContent = styled.div`
display: block;
border: none;
height: 110px;
position: absolute;
background-color: #fff;
width: 100%;
z-index: 1;
text-align: left;
color: #636363;
font-size: ${() => getFontSize(14)}px;
flex-direction: row;
font-weight: 700;
padding: 15px;
top: 120px;
left: 10px;
font-size: ${() => getFontSize(14)}px;
line-height: 2;
border-bottom: 1px solid #ededed;

`
const MedicalItems= [
  MEDICALMENU.MEDICALMEDICINE,
  MEDICALMENU.MEDICALHOSPITAL,

]

const Attendance = styled.div`

  font-family : Pretendard-SemiBold;
  background: #ff7e19;
  color: #fff;
  border-radius: 20px;
  padding: 3px 10px;
  font-size: ${() => getFontSize(12)}px;
  width:80px;

`

const LogoLayer = styled.div`
  display: flex;
  color : #ff7e19;
  font-size: ${() => getFontSize(20)}px;
  width:60%;
  align-items:center;
  justify-content: flex-start;
`;
const ButtonLayer = styled.div`

  display : flex;
  flex-direction: row;
  justify-content : center;
  align-items:center;
  font-size: ${() => getFontSize(14)}px;
  width: 40%;

`

const DownloadLayer = styled.div`

  display : flex;
  flex-direction: row;
  justify-content : flex-end;
  align-items:center;
  font-size: ${() => getFontSize(16)}px;

`
const DownloadButton = styled.div`
  color: #fe6625;
  background: #fe662538;
  font-size: ${() => getFontSize(14)}px;
  padding: 8px 15px;
  border-radius: 5px;
  font-family : Pretendard-SemiBold;
    
`
const Submenu = styled.div`
  padding:10px 10px;
  font-family:Pretendard-Regular;
  font-size: ${() => getFontSize(14)}px;
`
const Popupmenu = styled.div`
  width : 110px;
  display : flex;
  flex-direction: column;
  justify-content : flex-start;
  align-items:flex-start;
  position:absolute; 
  top:50px;
  background:#fff;
  padding:10px 0px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* 기본 그림자 */
  &:active {

    transform: scale(0.95); /* 눌렀을 때 크기 조정 */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 눌렀을 때 그림자 축소 */
  }

`

const MeuItems = [
  { url: "/PCMap", value: "도움요청", menulabel: "구해줘 알바 도움요청" },
  {url: "/PClife", value: "일상생활", menulabel: "구해줘 알바 라이프생활" },

  {url :"/PCleisure", value:"여가생활",menulabel:"구해줘 알바 여가생활"},
  {url :"/PCEvent", value:"이벤트",menulabel:"구해줘 알바 이벤트"},
  {url :"/PCGuide", value:"알아보기",menulabel:"구해줘 알바 알아보기"},
  {url :"/PCPolicy", value:"이용약관",menulabel:"구해줘 알바 이용약관"},
]

const BoardItems1 =[
  LIFEMENU.AI,
  LIFEMENU.BOARD,
  LIFEMENU.WORK,
  LIFEMENU.RECIPE,

]


const blinkstyle = `

  .blinkText {
    animation: blink 1s infinite;
  }

    @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }

`




const PCGateheader = ({ height}) => {

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [subhoveredIndex, setSubhoveredIndex] = useState(null);
  const navigation = useNavigate();
  const {user, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 상태 관리


  const _handleLifeMenu = (data) =>{
    navigation("/PClife", {state:{TYPE:data}});

  }
  const _handleHelp = () => {
    navigate("/PCMap", { state: { ID: "", TYPE: FILTERITMETYPE.HONG } });
  }

  return (
    <>
    <PCHeader height={height}>

      <style>{blinkstyle}</style>
      <TwoContainer id="twoheader">
        <BetweenRow style={{paddingLeft : '20px', background:"#fff", width:'100%', margin:"0 auto", height:60}} id="twosubheader">
          <LogoLayer onClick={()=>{}}>
            <Row>      
                <img to="/PCGate"  src={imageDB.logo} width={25} height={25} />
              <Link to="/PCGate">
                <div style={{ color:"#FE6625",fontFamily:"Pretendard-SemiBold",display:"flex", justifyContent:"center", alignItems:"center", paddingLeft:10}}>구해줘 알바</div>
                </Link>

            </Row>
          </LogoLayer>

          {/* <ButtonLayer>
          {
            MeuItems.map((data, index)=>(
              <Row style={{ height: 300, width: `${index == 1 ? '14%' : '12%'}`}}
              onMouseEnter={() => {setHoveredIndex(index);setIsOpen(true);}}
              onMouseLeave={() => {setHoveredIndex(null);setIsOpen(false);}}
              >
              {
                (index == 1 ) &&
                <div 
                key={index}
                style={{display:"flex", justifyContent:"center", alignItems:"center"}}
                className={`menu-item ${hoveredIndex !== null && hoveredIndex !== index ? 'dimmed' : ''}`}
                    >
                      <div title={data.value} aria-label={data.menulabel} style={{
                        marginRight: "2px", maxWidth: 70, width: 70, display: "flex",
                        flexDirection:"row"
                  }}>{data.value}
                        <div style={{ display: "flex" }}><MdKeyboardArrowDown size={20} /></div>  
                </div>
 
                {
                  (hoveredIndex == 1 && index == 1 && isOpen == true) && <Popupmenu>
                    {
                      BoardItems1.map((data, subindex)=>(
                        <Submenu 
                        onClick={()=>{_handleLifeMenu(data)}}
                        onMouseEnter={() => {setSubhoveredIndex(subindex);}}
                        onMouseLeave={() => {setSubhoveredIndex(null);}}
                        className={`submenu-item ${subhoveredIndex !== null && subhoveredIndex !== subindex ? 'dimmed' : ''}`}>{data}</Submenu>
                        ))
                    }
                  
                  </Popupmenu>
                }
                </div>
              }
              {
                (index  != 1  ) &&
                <Link 
                key={index}
                className={`menu-item ${hoveredIndex !== null && hoveredIndex !== index ? 'dimmed' : ''}`}
                to={data.url}><a title={data.value} aria-label={data.menulabel}  style={{marginRight:"20px",maxWidth:70, width:70}}>{data.value}
                </a>        
                </Link>
                }
        
              </Row>   
            ))
          }
              
            <Link to="/PCAppDownload"><DownloadButton>앱 다운로드</DownloadButton></Link>
          </ButtonLayer> */}





        </BetweenRow>


      
     
      </TwoContainer>

    </PCHeader>
    </>
  );
};

export default PCGateheader;
