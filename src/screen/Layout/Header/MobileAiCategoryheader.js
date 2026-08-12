import React, { Fragment, useContext, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { imageDB } from "../../../utility/imageData";
import { UserContext } from "../../../context/User";
import { GrPrevious } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import { CURRENTPAGE } from "../../../utility/router";
import { IoEllipseSharp } from "react-icons/io5";
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../../../common/Row";
import IconButton from "../../../common/IconButton";
import { BsHouseAdd } from "react-icons/bs";
import KakaoShare from "../../../components/KakaoShare";
import { useMediaQuery } from "react-responsive";

const Container = styled.div`
  background-color : #fff;
  scrollbar-width: none; // 스크롤바 안보이게 하기
  overflow-x: hidden; /* X축 스크롤을 숨깁니다. */
  overscroll-behavior: none; /* 터치 시 바운스 효과 제거 */
  height: calc(100vh - 10px);
  touch-action: pan-y;
`



const MobileAiCategoryheader = ({callback, registbtn, name, iconname, storebutton}) => {
  const navigation = useNavigate();
  const { user, dispatch } = useContext(UserContext);

  const location = useLocation();

  const _handleprev = () =>{

    if(location.pathname == CURRENTPAGE.MOBILESEARCH){
      navigation('/mobilemain');
    }else{
      navigation(-1);
    }
   
  }

  const _handlehistory = () =>{
    navigation("/Mobilesearchhistory");
  }
  const _handleCategory = () =>{
    navigation("/Mobileaicategorycreate");
  }


  const isGalaxyFlipUnfolded = useMediaQuery({ minWidth: 500, maxWidth: 767 });

  return (
    <Container
      id="header"
      style={{
        zIndex: 999,
        left: isGalaxyFlipUnfolded ? "20%" : "0",
        position: "fixed",
        background: "#fff",
        width: isGalaxyFlipUnfolded ? "60%" : "100%",
        height: "50px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderBottom: "1px solid #ededed",
        borderLeft: "1px solid #ededed",
        borderRight: "1px solid #ededed",
        fontFamily:"Pretendard-SemiBold",
  
      }}
    >

      <BetweenRow style={{width:"90%"}}>
        <Row>
          <div style={{ width: '10%', display: "flex", paddingLeft:10 }}>
            <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} onClick={_handleprev} />
          </div>
          <div style={{ display: "flex", fontFamily: "Pretendard-SemiBold", fontSize: () => getFontSize(20), paddingLeft:15 }}>
            {name.slice(0, 40)}
            {name.length > 40 ? "..." : null} 모음
          </div>
        </Row>
 


      </BetweenRow>
   
    
    
    </Container>
  );
};

export default MobileAiCategoryheader;
